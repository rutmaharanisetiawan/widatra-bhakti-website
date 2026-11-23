<?php

namespace Database\Seeders;

use App\Models\MediaAsset;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /** Representative subset mirroring products-data.ts structure/categories. */
    public function run(): void
    {
        $products = [
            [
                'code' => 'NACL-0-9-500', 'name' => 'Sodium Chloride 0.9% Infusion',
                'category' => 'Basic Intravenous', 'brand' => 'Generic',
                'osmolarity' => '308 mOsm/L', 'calorie' => '0 kcal/L', 'nie' => '-',
                'packaging' => ['Soft Bag', 'Bottle'], 'sizes' => ['100 mL', '250 mL', '500 mL', '1000 mL'],
                'indication' => 'Extracellular fluid replacement, vehicle for compatible drug administration, and wound irrigation.',
                'benefits' => ['Isotonic — well tolerated', 'Compatible with most IV medications', 'Sterile, pyrogen-free'],
                'applications' => ['Hydration therapy', 'Electrolyte replacement', 'Drug diluent'],
                'storage' => 'Store below 30°C, protect from freezing.', 'shelf_life' => '24 months from date of manufacture',
                'composition' => 'Each 100 mL contains Sodium Chloride 0.9 g in Water for Injection.',
                'manufacturing_note' => 'Manufactured in a Grade A closed-system filling line under PIC/S GMP.',
                'img' => MediaAsset::toRef('seed-iv-bag'), 'tagline' => 'The everyday standard for fluid therapy.',
            ],
            [
                'code' => 'RL-500', 'name' => "Ringer's Lactate Infusion",
                'category' => 'Basic Intravenous', 'brand' => 'Generic',
                'osmolarity' => '273 mOsm/L', 'calorie' => '9 kcal/L', 'nie' => '-',
                'packaging' => ['Soft Bag'], 'sizes' => ['500 mL', '1000 mL'],
                'indication' => 'Replacement of extracellular fluid and electrolyte losses, mild metabolic acidosis correction.',
                'benefits' => ['Closest electrolyte profile to plasma', 'Supports acid-base balance'],
                'applications' => ['Surgical fluid replacement', 'Trauma & burns resuscitation'],
                'storage' => 'Store below 30°C, protect from freezing.', 'shelf_life' => '24 months from date of manufacture',
                'composition' => 'Sodium Chloride, Sodium Lactate, Potassium Chloride, Calcium Chloride in Water for Injection.',
                'manufacturing_note' => null, 'img' => MediaAsset::toRef('seed-iv-bag'),
                'tagline' => 'Balanced electrolytes for critical care.',
            ],
            [
                'code' => 'D5-500', 'name' => 'Dextrose 5% Infusion',
                'category' => 'Specialty Solution', 'brand' => 'Generic',
                'osmolarity' => '253 mOsm/L', 'calorie' => '170 kcal/L', 'nie' => '-',
                'packaging' => ['Soft Bag', 'Bottle'], 'sizes' => ['250 mL', '500 mL'],
                'indication' => 'Caloric supplementation and free-water replacement.',
                'benefits' => ['Provides readily available energy source', 'Vehicle for IV medication'],
                'applications' => ['Hypoglycemia management', 'Fluid maintenance therapy'],
                'storage' => 'Store below 30°C.', 'shelf_life' => '24 months from date of manufacture',
                'composition' => 'Each 100 mL contains Dextrose Anhydrous 5 g in Water for Injection.',
                'manufacturing_note' => null, 'img' => MediaAsset::toRef('seed-vial'), 'tagline' => 'Gentle energy support.',
            ],
            [
                'code' => 'IRR-3000', 'name' => 'Sterile Water for Irrigation',
                'category' => 'Irrigation', 'brand' => 'Generic',
                'osmolarity' => '0 mOsm/L', 'calorie' => '0 kcal/L', 'nie' => '-',
                'packaging' => ['Bottle'], 'sizes' => ['1000 mL', '3000 mL'],
                'indication' => 'Surgical and wound irrigation — not for injection.',
                'benefits' => ['Non-pyrogenic, sterile', 'Wide-mouth bottle for surgical convenience'],
                'applications' => ['Urological irrigation', 'General surgical field irrigation'],
                'storage' => 'Store below 30°C.', 'shelf_life' => '36 months from date of manufacture',
                'composition' => 'Water for Injection.', 'manufacturing_note' => null,
                'img' => MediaAsset::toRef('seed-supplies'), 'tagline' => 'Purity built for the operating room.',
            ],
            [
                'code' => 'ADMIN-SET-01', 'name' => 'IV Administration Set',
                'category' => 'Medical Device', 'brand' => 'Branded',
                'osmolarity' => null, 'calorie' => null, 'nie' => 'AKD 20301234567',
                'packaging' => ['Individual sterile pouch'], 'sizes' => ['Standard 150cm'],
                'indication' => 'Delivery of IV fluids and medications from container to patient.',
                'benefits' => ['DEHP-free tubing available', 'Precision roller clamp for flow control'],
                'applications' => ['Hospital ward infusion therapy', 'Emergency & ICU use'],
                'storage' => 'Store in a cool, dry place.', 'shelf_life' => '60 months from date of manufacture',
                'composition' => 'Medical-grade PVC tubing, drip chamber, roller clamp, injection site.',
                'manufacturing_note' => 'ETO sterilized and validated per ISO 11135.',
                'img' => MediaAsset::toRef('seed-supplies'), 'tagline' => 'Reliable delivery, every drop.',
            ],
        ];

        foreach ($products as $p) {
            Product::create($p);
        }
    }
}
