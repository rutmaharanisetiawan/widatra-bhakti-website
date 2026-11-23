<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AddNoteRequest;
use App\Http\Requests\SubmitTourBookingRequest;
use App\Http\Requests\UpdateTourStatusRequest;
use App\Http\Resources\TourBookingResource;
use App\Models\TourBooking;
use App\Services\TourBookingService;
use Illuminate\Http\Request;

class TourBookingController extends Controller
{
    public function __construct(private TourBookingService $bookings) {}

    /** Admin — Factory Tour Management, every booking. */
    public function index(Request $request)
    {
        $this->authorize('manageAny', TourBooking::class);

        return TourBookingResource::collection($this->bookings->all());
    }

    /**
     * Public — no account required to book a visit. If the visitor happens
     * to be signed in, the booking is opportunistically linked to their account.
     */
    public function store(SubmitTourBookingRequest $request)
    {
        $user = $request->user() ?: auth('sanctum')->user();
        if ($user && $user->isInternal()) {
            abort(403, 'Karyawan internal tidak diizinkan melakukan reservasi Tur Pabrik.');
        }

        $booking = $this->bookings->submit($request->validated(), $user);

        return new TourBookingResource($booking);
    }

    /** Public status lookup — requires both the booking id and the email used to book, to prevent enumeration. */
    public function lookup(Request $request)
    {
        $request->validate(['id' => 'required|string', 'email' => 'required|email']);
        $booking = $this->bookings->findByIdAndEmail($request->input('id'), $request->input('email'));
        abort_if(! $booking, 404, 'No booking found for that confirmation code and email.');

        return new TourBookingResource($booking);
    }

    public function show(Request $request, TourBooking $tourBooking)
    {
        $this->authorize('view', $tourBooking);

        return new TourBookingResource($tourBooking);
    }

    public function updateStatus(UpdateTourStatusRequest $request, TourBooking $tourBooking)
    {
        $this->authorize('update', $tourBooking);
        $booking = $this->bookings->updateStatus($tourBooking, $request->input('status'), $request->input('note'));

        return new TourBookingResource($booking);
    }

    public function addNote(AddNoteRequest $request, TourBooking $tourBooking)
    {
        $this->authorize('update', $tourBooking);
        $booking = $this->bookings->addNote($tourBooking, $request->input('note'), $request->user());

        return new TourBookingResource($booking);
    }
}
