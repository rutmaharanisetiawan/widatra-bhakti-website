<?php

namespace App\Services;

/**
 * Generates human-readable, date-stamped record ids matching the frontend's
 * existing conventions exactly (e.g. APP-260708-0001, FT-260713-0001,
 * EVT-260724-0001) so nothing about the applicant-facing id format changes.
 */
class IdGenerator
{
    public static function make(string $prefix): string
    {
        $y = date('y');
        $m = date('m');
        $d = date('d');
        $seq = str_pad((string) random_int(1000, 9999), 4, '0', STR_PAD_LEFT);

        return "{$prefix}-{$y}{$m}{$d}-{$seq}";
    }

    public static function publicUserId(): string
    {
        return 'USR-'.now()->getTimestampMs().'-'.random_int(0, 999);
    }
}
