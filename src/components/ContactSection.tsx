import React from "react";
import { Phone, Mail, MapPin, Clock, MessageSquare, ArrowRight, Instagram, Facebook } from "lucide-react";

export default function ContactSection() {
  return (
    <div className="max-w-7xl mx-auto px-6 pb-16 space-y-10 text-white">
      {/* Title Header */}
      <div className="border-b border-zinc-900 pb-4 flex flex-col sm:flex-row sm:items-end justify-between">
        <div>
          <span className="text-xs text-amber-500 font-bold tracking-widest uppercase">Visit or Consult With Us</span>
          <h2 className="text-3xl font-bold font-display text-white mt-1">CONTACT & STUDIO LOCATION</h2>
        </div>
        <div className="flex items-center space-x-2 text-xs text-zinc-400 mt-2 sm:mt-0">
          <MapPin className="h-4.5 w-4.5 text-amber-500" />
          <span>Located in Utawala, Nairobi</span>
        </div>
      </div>

      {/* Main Grid Contact split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Contact details Card */}
        <div className="space-y-6">
          <div className="bg-zinc-950 p-6 sm:p-8 rounded-2xl border border-zinc-900 shadow-xl space-y-6">
            <h3 className="text-xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">
              MOH STYLIST LUXURY APARTMENT STUDIO
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Whether you are looking to book a bespoke custom clothing fitment, a professional hair silk-press makeover, or a masterclass skincare makeup routine, our doors are open in Utawala. Contact us to schedule.
            </p>

            <div className="space-y-4 pt-4 border-t border-zinc-900">
              <a
                href="tel:0708063447"
                className="flex items-start space-x-4 p-3 rounded-xl hover:bg-zinc-900/40 border border-transparent hover:border-amber-500/10 transition-all cursor-pointer group"
              >
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <span className="block text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Mobile Hotline 1</span>
                  <span className="text-sm font-semibold text-zinc-200 font-mono group-hover:text-amber-400 transition-colors">0708063447</span>
                  <span className="block text-[10px] text-zinc-500">Tap to call instantly (Primary Stylist Desk)</span>
                </div>
              </a>

              <a
                href="tel:0726313043"
                className="flex items-start space-x-4 p-3 rounded-xl hover:bg-zinc-900/40 border border-transparent hover:border-amber-500/10 transition-all cursor-pointer group"
              >
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <span className="block text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Direct Hotline 2 (Direct Call)</span>
                  <span className="text-sm font-semibold text-zinc-200 font-mono group-hover:text-amber-400 transition-colors">0726313043</span>
                  <span className="block text-[10px] text-zinc-500">Tap to dial instantly (Direct Call Desk)</span>
                </div>
              </a>

              <a
                href="mailto:infomorrisngatia@gmail.com"
                className="flex items-start space-x-4 p-3 rounded-xl hover:bg-zinc-900/40 border border-transparent hover:border-amber-500/10 transition-all cursor-pointer group"
              >
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <span className="block text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Electronic Mail</span>
                  <span className="text-sm font-semibold text-zinc-200 font-mono group-hover:text-amber-400 transition-colors">infomorrisngatia@gmail.com</span>
                  <span className="block text-[10px] text-zinc-500">Reply guaranteed within 2 hours</span>
                </div>
              </a>

              <a
                href="https://www.instagram.com/its_lamoh?igsh=dXZ1eTdhNmh1dzl3"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start space-x-4 p-3 rounded-xl hover:bg-zinc-900/40 border border-transparent hover:border-amber-500/10 transition-all cursor-pointer group"
              >
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Instagram className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <span className="block text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Instagram Profile</span>
                  <span className="text-sm font-semibold text-zinc-200 font-mono group-hover:text-amber-400 transition-colors">@its_lamoh</span>
                  <span className="block text-[10px] text-zinc-500">Follow for couture runway drops and fit checks</span>
                </div>
              </a>

              <a
                href="https://www.facebook.com/profile.php?id=61584217887777"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start space-x-4 p-3 rounded-xl hover:bg-zinc-900/40 border border-transparent hover:border-amber-500/10 transition-all cursor-pointer group"
              >
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Facebook className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <span className="block text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Facebook Page</span>
                  <span className="text-sm font-semibold text-zinc-200 group-hover:text-amber-400 transition-colors">Moh Stylist Couture</span>
                  <span className="block text-[10px] text-zinc-500">Follow for latest custom collections & updates</span>
                </div>
              </a>

              <div className="flex items-start space-x-4 p-3 rounded-xl border border-transparent">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <span className="block text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Studio Headquarters Address</span>
                  <span className="text-sm font-semibold text-zinc-200">Near Utawala Shopping Mall, 1st Floor Suite</span>
                  <span className="block text-xs text-zinc-400">Utawala, Nairobi, Kenya</span>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-3 rounded-xl border border-transparent">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <span className="block text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Operational Hours</span>
                  <span className="text-sm font-semibold text-zinc-200">Mon - Sat: 8:00 AM - 7:00 PM</span>
                  <span className="block text-xs text-zinc-400">Sundays: Bookings & VIP consultations only</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Embedded Map Visual */}
        <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 shadow-xl overflow-hidden h-[350px] sm:h-[450px] flex flex-col space-y-3">
          <div className="flex items-center justify-between text-xs font-mono px-1">
            <span className="text-zinc-400">📍 Utawala Shopping Mall Area, Nairobi</span>
            <span className="text-amber-400 font-bold">1st Floor Suite</span>
          </div>
          <div className="w-full h-full rounded-xl overflow-hidden border border-zinc-850">
            {/* Real embedded high quality map of Utawala Shopping Mall Area */}
            <iframe
              title="Moh Stylist Utawala Map Embed"
              src="https://maps.google.com/maps?q=Utawala%20Shopping%20Mall,%20Nairobi,%20Kenya&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              allowFullScreen={false}
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
