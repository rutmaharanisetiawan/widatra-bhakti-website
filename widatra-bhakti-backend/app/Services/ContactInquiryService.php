<?php

namespace App\Services;

use App\Models\ContactInquiry;
use App\Models\ContactReply;
use App\Models\User;
use App\Repositories\Contracts\ContactInquiryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class ContactInquiryService
{
    public function __construct(private ContactInquiryRepositoryInterface $inquiries) {}

    public function all(): Collection
    {
        return $this->inquiries->all();
    }

    public function find(string $id): ?ContactInquiry
    {
        return $this->inquiries->find($id);
    }

    public function unreadCount(): int
    {
        return $this->inquiries->unreadCount();
    }

    public function totalCount(): int
    {
        return $this->inquiries->totalCount();
    }

    /** Every Contact form on the public site calls this on submit. */
    public function submit(array $input): ContactInquiry
    {
        return $this->inquiries->create([
            'id' => 'ci-'.Str::uuid(),
            'name' => $input['name'],
            'organization' => $input['organization'] ?? null,
            'email' => $input['email'],
            'phone' => $input['phone'] ?? null,
            'subject' => $input['subject'],
            'message' => $input['message'],
            'source' => $input['source'] ?? 'Contact Page',
            'received_at' => now(),
            'read' => false,
            'archived' => false,
        ]);
    }

    public function markRead(ContactInquiry $inquiry): ContactInquiry
    {
        $inquiry->update(['read' => true]);

        return $inquiry;
    }

    public function setArchived(ContactInquiry $inquiry, bool $archived): ContactInquiry
    {
        $inquiry->update(['archived' => $archived]);

        return $inquiry;
    }

    public function reply(ContactInquiry $inquiry, string $message, User $author): ContactInquiry
    {
        ContactReply::create([
            'contact_inquiry_id' => $inquiry->id,
            'author_id' => $author->id,
            'message' => $message,
            'sent_at' => now(),
        ]);
        $inquiry->update(['read' => true]);

        return $inquiry->fresh('replies');
    }
}
