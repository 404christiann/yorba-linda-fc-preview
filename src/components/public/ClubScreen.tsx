"use client";

import { useState } from "react";
import { prospect } from "@/config/prospect";

export function ClubScreen() {
  const [notice, setNotice] = useState(false);
  return <div className="interior club-page"><header className="interior-hero"><span className="eyebrow">Our club</span><h1>{prospect.copy.club.headline[0]}<br/><em>{prospect.copy.club.headline[1]}</em></h1></header><section className="manifesto"><span className="story-mark">{String(prospect.club.foundedYear ?? "").slice(-2)}</span><div>{prospect.about.story.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><blockquote>“{prospect.about.mission}”</blockquote></section><section className="contact-section"><div><span className="eyebrow">Find us</span><h2>Club contact</h2><p>{prospect.contact.address}</p><a href={`mailto:${prospect.contact.email}`}>{prospect.contact.email}</a><p>{prospect.contact.phone}</p></div><form onSubmit={(e) => { e.preventDefault(); setNotice(true); }}><label>Name<input required placeholder="Your name"/></label><label>Email<input required type="email" placeholder="you@example.com"/></label><label>Message<textarea required rows={4} placeholder="How can the club help?"/></label><button>Prepare message</button><p role="status">{notice ? "Concept preview — messages aren’t sent from this demo." : "Messages are not sent from this concept preview."}</p></form></section></div>;
}
