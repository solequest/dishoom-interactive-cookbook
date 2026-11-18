import React from 'react';
import { X, ShieldCheck, Heart, ExternalLink } from 'lucide-react';
import { playClick } from '../audio/soundEffects';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#211C32]/60 backdrop-blur-xs transition-opacity"
        onClick={() => {
          playClick();
          onClose();
        }}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#FFFDF8] rounded-2xl border border-[#211C32]/15 shadow-2xl flex flex-col z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Editorial Header */}
        <div className="bg-[#F5EBDD] border-b border-[#211C32]/12 px-6 py-5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[#E9DDC7] border border-[#211C32]/15 flex items-center justify-center text-xl shadow-xs">
              🏛️
            </span>
            <div>
              <span className="text-[10px] font-mono font-semibold tracking-wider text-[#477E85] uppercase block">
                Academic Communication Design Lookbook
              </span>
              <h2 className="font-fraunces text-2xl font-bold text-[#211C32] tracking-tight leading-none">
                About & Credits
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="p-2 rounded-full bg-[#FFFDF8] hover:bg-[#E9DDC7] text-[#211C32] border border-[#211C32]/15 shadow-xs cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs font-sans text-[#211C32] leading-relaxed overflow-y-auto max-h-[75vh]">
          {/* Project Intent */}
          <div className="bg-[#F5EBDD]/60 p-4 rounded-xl border border-[#211C32]/10 shadow-xs">
            <h3 className="font-fraunces text-lg font-bold text-[#211C32] mb-1">
              From Page to Plate: An Interactive Café Experience
            </h3>
            <p className="mb-2">
              Cookbooks are often experienced as static recipes on a flat page, losing the rich sense of place, nostalgia, and communal warmth that makes the Dishoom cookbook extraordinary.
            </p>
            <p>
              This lookbook transforms recipe browsing into a spatial journey inside an illustrated Bombay Irani café. Discover morning rolls at the sunlit window, simmering black daal at the tandoor stove, and cutting chai by the brass kettle.
            </p>
          </div>

          {/* Academic & Copyright Attribution */}
          <div className="bg-[#70C5D0]/15 p-4 rounded-xl border border-[#70C5D0]/40 shadow-xs">
            <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-[#211C32]">
              <ShieldCheck className="w-4 h-4 text-[#477E85]" />
              <span>Ethical Attribution & Copyright Notice</span>
            </div>
            <p className="mb-2 text-[11.5px]">
              This project is created as an academic communication design showcase.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[11px] text-[#211C32]/90">
              <li>No recipe method steps, exact ingredient measurements, or photographs from the book are reproduced here.</li>
              <li>Descriptions and cultural notes are written in our own original words.</li>
              <li>Every recipe cites its chapter and page reference in the physical book to encourage readers to purchase and treasure the original work.</li>
            </ul>
          </div>

          {/* Author Credits */}
          <div className="bg-[#E9DDC7]/40 p-4 rounded-xl border border-[#211C32]/10">
            <h4 className="font-fraunces text-sm font-bold text-[#211C32] mb-1.5">Original Work Credits:</h4>
            <p className="text-[11.5px] mb-1">
              <strong>Cookbook</strong>: <em>Dishoom: From Bombay with Love</em>
            </p>
            <p className="text-[11.5px] mb-1">
              <strong>Authors</strong>: Shamil Thakrar, Kavi Thakrar, and Chef Naved Nasir
            </p>
            <p className="text-[11.5px]">
              <strong>Publisher</strong>: Bloomsbury Publishing
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#F5EBDD] border-t border-[#211C32]/12 px-6 py-3 text-center text-xs font-mono text-[#477E85] shrink-0">
          Designed with React, Tailwind CSS, Three.js, and GSAP.
        </div>
      </div>
    </div>
  );
}
