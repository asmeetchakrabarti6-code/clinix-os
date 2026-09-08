import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold">Clinix</p>
          <p className="mt-2 max-w-xs text-sm leading-6 text-white/70">
            Neighborhood clinic care with digital records, same-week appointments, and a clear care team.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-white/50">Visit</p>
          <p className="mt-2 text-sm leading-6 text-white/80">
            18 Harbor Lane
            <br />
            Weekdays 8:00 AM – 7:00 PM
            <br />
            Saturday 9:00 AM – 2:00 PM
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-white/50">Care</p>
          <div className="mt-2 flex flex-col gap-2 text-sm text-white/80">
            <Link href="/doctors" className="hover:text-white">
              Find a doctor
            </Link>
            <Link href="/appointments" className="hover:text-white">
              Book an appointment
            </Link>
            <Link href="/contact" className="hover:text-white">
              Emergency &amp; contact
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/45">
        Demo clinic app · Not for medical emergencies · Call local emergency services if you need urgent help
      </div>
    </footer>
  );
}
