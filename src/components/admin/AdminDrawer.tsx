"use client";

import { motion } from "framer-motion";
export function AdminDrawer({ title, eyebrow, onClose, children }: { title: string; eyebrow: string; onClose: () => void; children: React.ReactNode }) {
  return <div className="drawer-backdrop admin" onMouseDown={onClose}><motion.aside initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }} className="admin-drawer" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={title}><header><div><span>{eyebrow}</span><h2>{title}</h2></div><button onClick={onClose} aria-label="Close drawer">×</button></header>{children}</motion.aside></div>;
}
