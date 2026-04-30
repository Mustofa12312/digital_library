<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Paper;
use App\Models\PaperAuthor;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PaperController extends Controller
{
    public function index(Request $request)
    {
        $query = Paper::with(['author', 'assignedReviewer', 'coAuthors', 'latestReview']);

        // Authors can only see their own papers
        if ($request->user()->isAuthor()) {
            $query->where('author_id', $request->user()->id);
        }

        // Reviewers can only see papers assigned to them
        if ($request->user()->isReviewer()) {
            $query->where('assigned_reviewer_id', $request->user()->id);
        }

        // Filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('abstract', 'like', '%' . $request->search . '%')
                  ->orWhere('keywords', 'like', '%' . $request->search . '%');
            });
        }

        return response()->json(
            $query->latest()->paginate($request->get('per_page', 15))
        );
    }

    public function publicIndex(Request $request)
    {
        $query = Paper::with(['author', 'coAuthors'])
            ->where('status', 'published');

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('abstract', 'like', '%' . $request->search . '%')
                  ->orWhere('keywords', 'like', '%' . $request->search . '%');
            });
        }

        return response()->json(
            $query->latest()->paginate($request->get('per_page', 12))
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:500',
            'abstract' => 'required|string',
            'keywords' => 'nullable|string|max:500',
            'file' => 'nullable|file|mimes:pdf|max:20480', // 20MB max
            'co_authors' => 'nullable|array',
            'co_authors.*.name' => 'required_with:co_authors|string',
            'co_authors.*.email' => 'nullable|email',
            'co_authors.*.institution' => 'nullable|string',
        ]);

        $filePath = null;
        $fileName = null;
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileName = $file->getClientOriginalName();
            $filePath = $file->store('papers', 'public');
        }

        $paper = Paper::create([
            'title' => $request->title,
            'abstract' => $request->abstract,
            'keywords' => $request->keywords,
            'file_path' => $filePath,
            'file_name' => $fileName,
            'author_id' => $request->user()->id,
            'status' => Paper::STATUS_PENDING,
            'version' => 1,
        ]);

        if ($request->has('co_authors')) {
            foreach ($request->co_authors as $i => $author) {
                PaperAuthor::create([
                    'paper_id' => $paper->id,
                    'name' => $author['name'],
                    'email' => $author['email'] ?? null,
                    'institution' => $author['institution'] ?? null,
                    'order' => $i + 1,
                ]);
            }
        }

        ActivityLog::log('paper_submitted', "Paper '{$paper->title}' submitted", $paper);

        return response()->json($paper->load(['author', 'coAuthors']), 201);
    }

    public function show(Request $request, Paper $paper)
    {
        // Authors can only view their own papers (unless published)
        if ($request->user() && $request->user()->isAuthor() && $paper->author_id !== $request->user()->id && $paper->status !== 'published') {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        return response()->json($paper->load(['author', 'assignedReviewer', 'coAuthors', 'reviews.reviewer']));
    }

    public function update(Request $request, Paper $paper)
    {
        $user = $request->user();

        // Only author can update pending/revision papers
        if ($user->isAuthor()) {
            if ($paper->author_id !== $user->id) {
                return response()->json(['message' => 'Forbidden.'], 403);
            }
            if (!in_array($paper->status, ['pending', 'revision'])) {
                return response()->json(['message' => 'Paper cannot be edited at this stage.'], 422);
            }
        }

        $request->validate([
            'title' => 'sometimes|string|max:500',
            'abstract' => 'sometimes|string',
            'keywords' => 'nullable|string|max:500',
            'file' => 'nullable|file|mimes:pdf|max:20480',
            'status' => 'sometimes|in:pending,under_review,accepted,revision,rejected,published',
            'assigned_reviewer_id' => 'nullable|exists:users,id',
            'admin_notes' => 'nullable|string',
        ]);

        if ($request->hasFile('file')) {
            if ($paper->file_path) {
                Storage::disk('public')->delete($paper->file_path);
            }
            $file = $request->file('file');
            $paper->file_name = $file->getClientOriginalName();
            $paper->file_path = $file->store('papers', 'public');
            $paper->version += 1;
        }

        $paper->fill($request->only(['title', 'abstract', 'keywords', 'status', 'assigned_reviewer_id', 'admin_notes']));
        $paper->save();

        ActivityLog::log('paper_updated', "Paper '{$paper->title}' updated to status: {$paper->status}", $paper);

        return response()->json($paper->load(['author', 'assignedReviewer', 'coAuthors']));
    }

    public function destroy(Paper $paper)
    {
        if ($paper->file_path) {
            Storage::disk('public')->delete($paper->file_path);
        }
        ActivityLog::log('paper_deleted', "Paper '{$paper->title}' deleted", null);
        $paper->delete();

        return response()->json(['message' => 'Paper berhasil dihapus.']);
    }

    public function assignReviewer(Request $request, Paper $paper)
    {
        $request->validate([
            'reviewer_id' => 'required|exists:users,id',
        ]);

        $reviewer = \App\Models\User::findOrFail($request->reviewer_id);
        if (!$reviewer->isReviewer()) {
            return response()->json(['message' => 'User bukan reviewer.'], 422);
        }

        $paper->update([
            'assigned_reviewer_id' => $request->reviewer_id,
            'status' => Paper::STATUS_UNDER_REVIEW,
        ]);

        ActivityLog::log('reviewer_assigned', "Reviewer '{$reviewer->name}' assigned to paper '{$paper->title}'", $paper);

        return response()->json($paper->load(['author', 'assignedReviewer']));
    }
}
