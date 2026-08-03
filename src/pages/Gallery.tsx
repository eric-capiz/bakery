import { useState } from "react";
import Link from "next/link";

type Loc = "shop" | "mobile";

interface Service {
  id: string;
  name: string;
  blurb: string;
  shop: number;
  mobile: number;
  tag: string;
}

const SERVICES: Service[] = [
  {
    id: "oil",
    name: "Oil & filter",
    blurb: "Blend oil, new filter, top-offs, quick walkaround.",
    shop: 69,
    mobile: 99,
    tag: "Maintenance",
  },
  {
    id: "brakes",
    name: "Brake pads / axle",
    blurb: "Pads, hardware check, rotor measure. Rotors extra if needed.",
    shop: 189,
    mobile: 249,
    tag: "Brakes",
  },
  {
    id: "battery",
    name: "Battery install",
    blurb: "Test, swap, clean terminals. Battery billed at cost.",
    shop: 149,
    mobile: 189,
    tag: "Electrical",
  },
  {
    id: "diag",
    name: "Full diagnostic",
    blurb: "Scan, live data, plain-English write-up.",
    shop: 129,
    mobile: 159,
    tag: "Diagnostics",
  },
  {
    id: "tires",
    name: "Rotate & balance",
    blurb: "Four tires, balance, set pressures.",
    shop: 79,
    mobile: 119,
    tag: "Tires",
  },
  {
    id: "coolant",
    name: "Coolant flush",
    blurb: "Drain, flush, refill to spec.",
    shop: 159,
    mobile: 199,
    tag: "Maintenance",
  },
  {
    id: "plugs",
    name: "Spark plugs (4-cyl)",
    blurb: "Plugs + boot check. 6/8-cyl quoted after look.",
    shop: 179,
    mobile: 229,
    tag: "Engine",
  },
  {
    id: "ac",
    name: "A/C recharge",
    blurb: "Leak check, vacuum, recharge.",
    shop: 169,
    mobile: 209,
    tag: "Comfort",
  },
  {
    id: "wipers",
    name: "Wiper blades",
    blurb: "Front install. Blades at cost.",
    shop: 39,
    mobile: 59,
    tag: "Quick",
  },
  {
    id: "ppi",
    name: "Pre-purchase inspect",
    blurb: "Lift, scan, road notes. Shop bay only.",
    shop: 149,
    mobile: 0,
    tag: "Inspect",
  },
];

const money = (n: number) => (n === 0 ? "—" : `$${n}`);

const Services = () => {
  const [loc, setLoc] = useState<Loc>("shop");

  return (
    <div className="pt-page pt-services">
      <header className="pt-page-head">
        <p className="pt-kicker">Services</p>
        <h1>Price board</h1>
        <p>
          Toggle shop vs mobile. Mobile trip fee by zone is listed under the
          switch.
        </p>
      </header>

      <div className="pt-switch" role="group" aria-label="Location">
        <button
          type="button"
          className={loc === "shop" ? "is-on" : ""}
          onClick={() => setLoc("shop")}
        >
          Shop bay
        </button>
        <button
          type="button"
          className={loc === "mobile" ? "is-on" : ""}
          onClick={() => setLoc("mobile")}
        >
          Mobile
        </button>
      </div>

      <p className="pt-note">
        {loc === "mobile"
          ? "Mobile trip fee: Zone A (0–10 mi) included · Zone B +$25 · Zone C +$45. Parts at cost."
          : "Shop prices = labor + standard supplies. Parts at cost with receipt."}
      </p>

      <div className="pt-board">
        {SERVICES.map((s) => {
          const price = loc === "shop" ? s.shop : s.mobile;
          const blocked = loc === "mobile" && s.mobile === 0;
          return (
            <article key={s.id} className="pt-board-row">
              <div>
                <span>{s.tag}</span>
                <h2>{s.name}</h2>
                <p>{s.blurb}</p>
              </div>
              <div className="pt-board-price">
                <strong>{blocked ? "Shop only" : money(price)}</strong>
                <small>
                  Shop {money(s.shop)} · Mobile {money(s.mobile)}
                </small>
              </div>
            </article>
          );
        })}
      </div>

      <div className="pt-page-foot">
        <p>Don&apos;t see it? Ask — we quote before we start.</p>
        <Link href="/book" className="pt-btn">
          Book now
        </Link>
      </div>
    </div>
  );
};

export default Services;
