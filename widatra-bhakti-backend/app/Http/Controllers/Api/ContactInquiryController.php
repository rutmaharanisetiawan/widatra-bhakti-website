<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReplyContactInquiryRequest;
use App\Http\Requests\SubmitContactInquiryRequest;
use App\Http\Resources\ContactInquiryResource;
use App\Models\ContactInquiry;
use App\Services\ContactInquiryService;
use Illuminate\Http\Request;

class ContactInquiryController extends Controller
{
    public function __construct(private ContactInquiryService $inquiries) {}

    public function index()
    {
        $this->authorize('manageAny', ContactInquiry::class);

        return ContactInquiryResource::collection($this->inquiries->all());
    }

    public function counts()
    {
        $this->authorize('manageAny', ContactInquiry::class);

        return response()->json([
            'unread' => $this->inquiries->unreadCount(),
            'total' => $this->inquiries->totalCount(),
        ]);
    }

    public function show(ContactInquiry $contactInquiry)
    {
        $this->authorize('manageAny', ContactInquiry::class);
        $this->inquiries->markRead($contactInquiry);

        return new ContactInquiryResource($contactInquiry);
    }

    /** Every Contact form on the public site posts here. */
    public function store(SubmitContactInquiryRequest $request)
    {
        $inquiry = $this->inquiries->submit($request->validated());

        return new ContactInquiryResource($inquiry);
    }

    public function archive(ContactInquiry $contactInquiry)
    {
        $this->authorize('manageAny', ContactInquiry::class);
        $inquiry = $this->inquiries->setArchived($contactInquiry, true);

        return new ContactInquiryResource($inquiry);
    }

    public function unarchive(ContactInquiry $contactInquiry)
    {
        $this->authorize('manageAny', ContactInquiry::class);
        $inquiry = $this->inquiries->setArchived($contactInquiry, false);

        return new ContactInquiryResource($inquiry);
    }

    public function reply(ReplyContactInquiryRequest $request, ContactInquiry $contactInquiry)
    {
        $this->authorize('manageAny', ContactInquiry::class);
        $inquiry = $this->inquiries->reply($contactInquiry, $request->input('message'), $request->user());

        return new ContactInquiryResource($inquiry);
    }
}
