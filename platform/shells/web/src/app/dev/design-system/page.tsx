"use client";

import { cn } from "@/lib/cn";

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">
            Design System
          </h1>
          <p className="text-sm text-muted-foreground">
            ACME Ecosystem UI Components (dev-only)
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Colors */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <ColorSwatch name="Background" className="bg-background border" />
            <ColorSwatch name="Foreground" className="bg-foreground" />
            <ColorSwatch name="Card" className="bg-card border" />
            <ColorSwatch name="Primary" className="bg-primary" />
            <ColorSwatch name="Secondary" className="bg-secondary" />
            <ColorSwatch name="Muted" className="bg-muted" />
            <ColorSwatch name="Accent" className="bg-accent" />
            <ColorSwatch name="Destructive" className="bg-destructive" />
            <ColorSwatch name="Border" className="bg-border" />
            <ColorSwatch name="Input" className="bg-input" />
            <ColorSwatch name="Ring" className="bg-ring" />
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Typography</h2>
          <div className="space-y-4 bg-card rounded-lg border p-6">
            <div>
              <p className="text-xs text-muted-foreground mb-1">text-3xl font-bold</p>
              <p className="text-3xl font-bold">Heading 1</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">text-2xl font-semibold</p>
              <p className="text-2xl font-semibold">Heading 2</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">text-xl font-medium</p>
              <p className="text-xl font-medium">Heading 3</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">text-base</p>
              <p className="text-base">Body text - The quick brown fox jumps over the lazy dog.</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">text-sm text-muted-foreground</p>
              <p className="text-sm text-muted-foreground">Muted text for secondary information.</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">font-mono</p>
              <p className="font-mono">const code = "monospace";</p>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-4 bg-card rounded-lg border p-6">
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
              Primary
            </button>
            <button className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors">
              Secondary
            </button>
            <button className="px-4 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-accent transition-colors">
              Outline
            </button>
            <button className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90 transition-colors">
              Destructive
            </button>
            <button className="px-4 py-2 rounded-lg text-muted-foreground font-medium hover:text-foreground hover:bg-accent transition-colors">
              Ghost
            </button>
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium opacity-50 cursor-not-allowed" disabled>
              Disabled
            </button>
          </div>
        </section>

        {/* Form Elements */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Form Elements</h2>
          <div className="grid md:grid-cols-2 gap-6 bg-card rounded-lg border p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Text Input
                </label>
                <input
                  type="text"
                  placeholder="Enter text..."
                  className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password Input
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Select
                </label>
                <select className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Option 1</option>
                  <option>Option 2</option>
                  <option>Option 3</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Textarea
                </label>
                <textarea
                  placeholder="Enter description..."
                  rows={3}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Cards</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground mb-2">Basic Card</h3>
              <p className="text-sm text-muted-foreground">
                A simple card with border and padding.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
              <h3 className="font-semibold text-foreground mb-2">Elevated Card</h3>
              <p className="text-sm text-muted-foreground">
                A card with shadow for elevation.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-semibold text-foreground mb-2">Interactive Card</h3>
              <p className="text-sm text-muted-foreground">
                Hover for shadow effect.
              </p>
            </div>
          </div>
        </section>

        {/* Alerts */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Alerts</h2>
          <div className="space-y-4">
            <div className="rounded-lg bg-green-50 border border-green-200 p-4 dark:bg-green-900/20 dark:border-green-800">
              <p className="text-sm font-medium text-green-800 dark:text-green-400">
                ✓ Success - Your action was completed successfully.
              </p>
            </div>
            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 dark:bg-yellow-900/20 dark:border-yellow-800">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                ⚠ Warning - Please review before proceeding.
              </p>
            </div>
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 dark:bg-red-900/20 dark:border-red-800">
              <p className="text-sm font-medium text-red-800 dark:text-red-400">
                ✗ Error - Something went wrong. Please try again.
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 dark:bg-blue-900/20 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-400">
                ℹ Info - Here's some helpful information.
              </p>
            </div>
          </div>
        </section>

        {/* Spacing */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Spacing Scale</h2>
          <div className="bg-card rounded-lg border p-6">
            <div className="space-y-2">
              {[1, 2, 4, 6, 8, 12, 16].map((size) => (
                <div key={size} className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-12">p-{size}</span>
                  <div className={`bg-primary/20 p-${size}`}>
                    <div className="bg-primary w-4 h-4 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function ColorSwatch({ name, className }: { name: string; className: string }) {
  return (
    <div className="space-y-2">
      <div className={cn("w-full h-16 rounded-lg", className)}></div>
      <p className="text-xs text-muted-foreground">{name}</p>
    </div>
  );
}

