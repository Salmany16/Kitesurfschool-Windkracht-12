<?php

namespace App\Http\Controllers;

use App\Models\SimulatedEmail;
use Illuminate\Http\Request;

class MailSimulatorController extends Controller
{
    /**
     * Retrieve all simulated emails.
     */
    public function index()
    {
        $emails = SimulatedEmail::orderBy('id', 'desc')->get();

        return response()->json([
            'emails' => $emails
        ]);
    }

    /**
     * Clear all simulated emails.
     */
    public function clear()
    {
        SimulatedEmail::truncate();

        return response()->json([
            'message' => 'Simulated mailbox cleared.'
        ]);
    }
}
