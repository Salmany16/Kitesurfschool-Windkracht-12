<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Package;
use App\Models\Profile;
use App\Models\Location;
use App\Models\Photo;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Packages
        $packages = [
            [
                'name' => 'Privéles 2,5 uur',
                'duration_hours' => 2.5,
                'price' => 175.00,
                'max_persons' => 1,
                'lessons_count' => 1,
            ],
            [
                'name' => 'Losse Duo Kiteles 3,5 uur',
                'duration_hours' => 3.5,
                'price' => 135.00,
                'max_persons' => 2,
                'lessons_count' => 1,
            ],
            [
                'name' => 'Kitesurf Duo lespakket 3 lessen 10,5 uur',
                'duration_hours' => 10.5,
                'price' => 375.00,
                'max_persons' => 2,
                'lessons_count' => 3,
            ],
            [
                'name' => 'Kitesurf Duo lespakket 5 lessen 17,5 uur',
                'duration_hours' => 17.5,
                'price' => 675.00,
                'max_persons' => 2,
                'lessons_count' => 5,
            ]
        ];

        foreach ($packages as $pkg) {
            Package::create($pkg);
        }

        // 2. Seed Owner
        $owner = User::create([
            'name' => 'Terence Olieslager',
            'email' => 'owner@windkracht12.nl',
            'password' => Hash::make('Password123!'),
            'role' => 'owner',
            'email_verified_at' => now(),
        ]);

        Profile::create([
            'user_id' => $owner->id,
            'name' => 'Terence Olieslager',
            'address' => 'Domplein 5',
            'city' => 'Utrecht',
            'birthdate' => '1980-04-12',
            'bsn_number' => '123456789',
            'mobile_number' => '0612345678',
        ]);

        // 3. Seed 5 Instructors
        $instructors = [
            [
                'name' => 'Duco Veenstra',
                'email' => 'duco@windkracht12.nl',
                'birthdate' => '1988-06-15',
                'bsn' => '987654321',
                'mobile' => '0687654321',
            ],
            [
                'name' => 'Waldemar van Dongen',
                'email' => 'waldemar@windkracht12.nl',
                'birthdate' => '1990-11-22',
                'bsn' => '876543210',
                'mobile' => '0676543210',
            ],
            [
                'name' => 'Ruud Terlingen',
                'email' => 'ruud@windkracht12.nl',
                'birthdate' => '1985-02-28',
                'bsn' => '765432109',
                'mobile' => '0665432109',
            ],
            [
                'name' => 'Saskia Brink',
                'email' => 'saskia@windkracht12.nl',
                'birthdate' => '1993-08-09',
                'bsn' => '654321098',
                'mobile' => '0654321098',
            ],
            [
                'name' => 'Bernie Vredenstein',
                'email' => 'bernie@windkracht12.nl',
                'birthdate' => '1992-05-04',
                'bsn' => '543210987',
                'mobile' => '0643210987',
            ]
        ];

        foreach ($instructors as $inst) {
            $user = User::create([
                'name' => $inst['name'],
                'email' => $inst['email'],
                'password' => Hash::make('Password123!'),
                'role' => 'instructor',
                'email_verified_at' => now(),
            ]);

            Profile::create([
                'user_id' => $user->id,
                'name' => $inst['name'],
                'address' => 'Vissershavenweg ' . rand(1, 100),
                'city' => 'Scheveningen',
                'birthdate' => $inst['birthdate'],
                'bsn_number' => $inst['bsn'],
                'mobile_number' => $inst['mobile'],
            ]);
        }

        // 4. Seed a Sample Customer
        $customer = User::create([
            'name' => 'Jan de Kiter',
            'email' => 'client@windkracht12.nl',
            'password' => Hash::make('Password123!'),
            'role' => 'customer',
            'email_verified_at' => now(),
        ]);

        Profile::create([
            'user_id' => $customer->id,
            'name' => 'Jan de Kiter',
            'address' => 'Kustweg 42',
            'city' => 'Zandvoort',
            'birthdate' => '1995-10-10',
            'mobile_number' => '0699887766',
        ]);

        // 5. Seed Locations
        $locations = [
            [
                'name' => 'Muiderberg',
                'difficulty' => 'beginner',
                'difficulty_label' => '🟢 Uitstekend voor Beginners',
                'water_type' => 'Vlak & Ondiep',
                'wind_directions' => 'N, NO, O, NW',
                'crowd_level' => 'Druk op zonnige dagen',
                'description' => 'Gelegen aan het ondiepe IJmeer. Doordat je hier tot honderden meters ver in het water kunt staan, is Muiderberg de ultieme leslocatie voor beginners en herstarters. Geen golven of sterke getijdenstroming!',
                'safety_tips' => 'Let op de drukte nabij het strand en eventuele recreatieve zwemmers.',
                'icon' => '🏖️'
            ],
            [
                'name' => 'IJmuiden',
                'difficulty' => 'beginner',
                'difficulty_label' => '🟡 Ideaal voor Beginners & Intermediates',
                'water_type' => 'Vlak tot Kabbel (binnen de pieren)',
                'wind_directions' => 'ZW, W, NW, N',
                'crowd_level' => 'Gemiddeld',
                'description' => 'IJmuiden biedt door de enorme pieren een uniek en beschut surfgebied. Het water binnen de pieren is relatief vlak, wat ideaal is om boardstarts en bochten te oefenen zonder last te hebben van grote zeegolven.',
                'safety_tips' => 'Blijf op veilige afstand van de havenmonding en de grote pierblokken.',
                'icon' => '⚓'
            ],
            [
                'name' => 'Hoek van Holland',
                'difficulty' => 'intermediate',
                'difficulty_label' => '🟡 Geschikt voor Intermediates & Gevorderden',
                'water_type' => 'Choppy water met matige golven',
                'wind_directions' => 'Z, ZW, W, NW',
                'crowd_level' => 'Rustig tot Gemiddeld',
                'description' => 'Een prachtig breed zandstrand met uitstekende surfcondities. Door de ligging kan er met veel windrichtingen veilig gevaren worden. Ideaal voor kiters die de overstap maken naar open zee.',
                'safety_tips' => 'Houd rekening met de vaargeul van de Rotterdamse haven.',
                'icon' => '🏗️'
            ],
            [
                'name' => 'Zandvoort',
                'difficulty' => 'advanced',
                'difficulty_label' => '🔴 Alleen voor Gevorderden',
                'water_type' => 'Open zee, Hoge golven & Branding',
                'wind_directions' => 'ZW, W, NW, N',
                'crowd_level' => 'Druk',
                'description' => 'Zandvoort is een legendarische spot met krachtige golven en een stevige branding. De sterke stroming en branding maken deze spot uitsluitend geschikt voor ervaren kiters en gevorderde lessers onder begeleiding.',
                'safety_tips' => 'Sterke getijdenstroming. Vaar nooit alleen op open zee.',
                'icon' => '🏄‍♂️'
            ],
            [
                'name' => 'Wijk aan Zee',
                'difficulty' => 'advanced',
                'difficulty_label' => '🔴 Alleen voor Gevorderden',
                'water_type' => 'Ruige zee & Hoge branding',
                'wind_directions' => 'ZW, W, NW, N',
                'crowd_level' => 'Druk (populair onder golfsurfers)',
                'description' => 'Wijk aan Zee staat bekend om de beste en hoogste golven van Nederland. Het is de ultieme speeltuin voor freestyle- en wave-kiters. Niet geschikt voor beginners vanwege de zware branding.',
                'safety_tips' => 'Houd voldoende afstand van de noordpier van IJmuiden.',
                'icon' => '🏭'
            ],
            [
                'name' => 'Scheveningen',
                'difficulty' => 'advanced',
                'difficulty_label' => '🔴 Alleen voor Gevorderden',
                'water_type' => 'Ruige zee, Sterke stroming & Branding',
                'wind_directions' => 'ZZW, ZW, W, NW, N',
                'crowd_level' => 'Zeer druk',
                'description' => 'Gelegen naast de havenhoofden. Scheveningen heeft fantastische surfcondities maar vereist uitstekende kiteloop- en boardbeheersing. De sterke stroming langs de kustlijn vormt een extra uitdaging.',
                'safety_tips' => 'Pas op voor de havenhoofden en de sterke stroming langs de kust.',
                'icon' => '🎡'
            ]
        ];

        foreach ($locations as $loc) {
            Location::create($loc);
        }

        // 6. Seed Photos
        $photos = [
            [
                'title' => 'Adembenemende Big Air',
                'spot' => 'Zandvoort',
                'kiter' => 'Waldemar van Dongen (Instructeur)',
                'wind' => '28 Knopen - ZW (7 Bft)',
                'gear' => 'Duotone Rebel 9m + Jaime Board',
                'description' => 'Waldemar laat zien hoe je met sterke wind de golven als schans gebruikt om metershoog boven de branding van Zandvoort uit te stijgen.',
                'img_url' => '/gallery_hero.png',
                'gradient' => null,
                'icon' => null,
            ],
            [
                'title' => 'Eerste Waterstart Succes',
                'spot' => 'Muiderberg',
                'kiter' => 'Lars de Wit (Cursist)',
                'wind' => '14 Knopen - N (4 Bft)',
                'gear' => 'Core XR7 12m + Fusion Board',
                'description' => 'Het ultieme gevoel van triomf! Lars maakt zijn allereerste meters op het board in het ondiepe, spiegelgladde water van Muiderberg.',
                'img_url' => null,
                'gradient' => 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                'icon' => '🏄‍♂️',
            ],
            [
                'title' => 'Duo Kitesurf Training',
                'spot' => 'IJmuiden',
                'kiter' => 'Anouk & Sophie (Duo Cursisten)',
                'wind' => '17 Knopen - NW (4-5 Bft)',
                'gear' => 'Cabrinha Switchblade 10m & 12m',
                'description' => 'Samen leren kiten is twee keer zo leuk! Anouk en Sophie trainen hun bodydrag-techniek onder begeleiding van instructeur Saskia.',
                'img_url' => null,
                'gradient' => 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                'icon' => '👥',
            ],
            [
                'title' => 'Sunset Wave Gliding',
                'spot' => 'Wijk aan Zee',
                'kiter' => 'Saskia Brink (Instructeur)',
                'wind' => '22 Knopen - W (5 Bft)',
                'gear' => 'F-One Bandit 8m + Surfboard',
                'description' => 'Saskia surft met een speciaal wave-board over de perfecte golven bij Wijk aan Zee tijdens een magische zonsondergang.',
                'img_url' => null,
                'gradient' => 'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
                'icon' => '🌅',
            ],
            [
                'title' => 'Techniek & Veiligheidskliniek',
                'spot' => 'Hoek van Holland',
                'kiter' => 'Bernie Vredenstein (Instructeur)',
                'wind' => '19 Knopen - ZW (5 Bft)',
                'gear' => 'Duotone Neo 11m',
                'description' => 'Veiligheid staat voorop. Bernie legt op het brede strand van Hoek van Holland uit hoe het quick-release veiligheidssysteem werkt.',
                'img_url' => null,
                'gradient' => 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                'icon' => '🛡️',
            ],
            [
                'title' => 'Nieuwe Spullen Gear-Check',
                'spot' => 'Utrecht (School Basis)',
                'kiter' => 'Terence Olieslager (Eigenaar)',
                'wind' => 'Geen wind (Strand-werk)',
                'gear' => 'Volledige 2026 Duotone & Core line-up',
                'description' => 'Terence inspecteert onze gloednieuwe materialen. Wij vernieuwen elk seizoen al onze kites en wetsuits om maximale veiligheid te garanderen.',
                'img_url' => null,
                'gradient' => 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
                'icon' => '📦',
            ]
        ];

        foreach ($photos as $ph) {
            Photo::create($ph);
        }
    }
}
