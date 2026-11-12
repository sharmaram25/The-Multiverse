'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { Tabs } from '@/components/ui/tabs';
import Link from 'next/link';
import { Check, ChevronRight, Heart, Link2, Share2, ShoppingBag } from 'lucide-react';
import { copyText } from '@/lib/browser';
import { cn } from '@/lib/utils';

export default function ComponentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [cart, setCart] = useState(0);
  const [linkCopied, setLinkCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-display">Pattern Gallery</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Real interface patterns composed from the component library. Everything here is interactive and adapts to the active universe. For APIs and usage code, see the <Link href="/design-system/components" className="text-foreground underline underline-offset-4">component reference</Link>.
        </p>
      </motion.div>

      <div className="space-y-24">
        {/* Buttons Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-8 flex items-center gap-2 border-b border-border pb-4">
            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">01</span>
            Buttons
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
            <div className="flex flex-col items-center gap-2">
              <Button variant="default">Primary</Button>
              <span className="text-xs text-muted-foreground">Default</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button variant="secondary">Secondary</Button>
              <span className="text-xs text-muted-foreground">Secondary</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button variant="outline">Outline</Button>
              <span className="text-xs text-muted-foreground">Outline</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button variant="ghost">Ghost</Button>
              <span className="text-xs text-muted-foreground">Ghost</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button variant="gradient">Inverse</Button>
              <span className="text-xs text-muted-foreground">Inverse</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button variant="neon">Accent outline</Button>
              <span className="text-xs text-muted-foreground">Accent outline</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button variant="glass">Frosted</Button>
              <span className="text-xs text-muted-foreground">Frosted</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button isLoading>Loading</Button>
              <span className="text-xs text-muted-foreground">Loading</span>
            </div>
          </div>
        </section>

        {/* Inputs Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-8 flex items-center gap-2 border-b border-border pb-4">
            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">02</span>
            Input Fields
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-2">
              <label htmlFor="pg-email" className="text-sm font-medium">Standard Input</label>
              <Input id="pg-email" type="email" placeholder="you@company.com" />
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium">Floating Label</span>
              <Input variant="floating" label="Username" />
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium">Search Input</span>
              <Input variant="search" placeholder="Search components…" aria-label="Search components" />
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium">Password Input</span>
              <Input variant="password" placeholder="Enter password" aria-label="Password" />
            </div>
            <div className="space-y-2 lg:col-span-4">
              <span className="text-sm font-medium mb-2 block">OTP Input</span>
              <Input variant="otp" aria-label="One-time code" />
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-8 flex items-center gap-2 border-b border-border pb-4">
            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">03</span>
            Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <Card hoverEffect>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold" aria-hidden="true">AC</div>
                <div>
                  <CardTitle className="text-lg">Alex Chen</CardTitle>
                  <CardDescription>Frontend Engineer</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Design systems and front-end architecture. Twelve years shipping product interfaces.
                </p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" size="sm" className="w-full" aria-pressed={following} onClick={() => setFollowing((v) => !v)}>{following ? 'Following' : 'Follow'}</Button>
                <Button size="sm" className="w-full" onClick={() => setIsModalOpen(true)}>Share profile</Button>
              </CardFooter>
            </Card>

            {/* Product Card */}
            <Card hoverEffect className="overflow-hidden">
              <div className="h-48 bg-muted relative flex items-center justify-center overflow-hidden">
                <div className="grid grid-cols-8 gap-1.5 rotate-[-8deg] opacity-80" aria-hidden="true">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <span key={i} className={cn('h-7 w-7 rounded-md border border-border shadow-sm', i === 13 || i === 22 ? 'bg-primary' : 'bg-card')} />
                  ))}
                </div>
                <button
                  type="button"
                  aria-pressed={liked}
                  aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
                  onClick={() => setLiked((v) => !v)}
                  className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-md rounded-full border border-border hover:bg-background transition-colors"
                >
                  <Heart size={18} className={liked ? 'fill-destructive text-destructive' : ''} />
                </button>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Mechanical Keyboard</CardTitle>
                    <CardDescription>Wireless 75% Layout</CardDescription>
                  </div>
                  <span className="font-bold text-lg">$149</span>
                </div>
              </CardHeader>
              <CardFooter>
                <Button className="w-full" onClick={() => setCart((c) => c + 1)}>
                  {cart > 0 ? <><Check size={16} className="mr-2" /> In cart ({cart})</> : <><ShoppingBag size={16} className="mr-2" /> Add to cart</>}
                </Button>
              </CardFooter>
            </Card>

            {/* Statistic Card */}
            <Card hoverEffect>
              <CardHeader className="pb-2">
                <CardDescription>Total Revenue</CardDescription>
                <CardTitle className="text-4xl">$45,231.89</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-success flex items-center gap-1 font-medium">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.14645 8.14645C3.95118 8.34171 3.6346 8.34171 3.43934 8.14645C3.24408 7.95118 3.24408 7.6346 3.43934 7.43934L7.14645 3.73223C7.34171 3.53697 7.65829 3.53697 7.85355 3.73223L11.5607 7.43934C11.7559 7.6346 11.7559 7.95118 11.5607 8.14645C11.3654 8.34171 11.0488 8.34171 10.8536 8.14645L7.5 4.79289L4.14645 8.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                  +20.1% from last month
                </div>
                <div className="mt-4 h-16 w-full flex items-end gap-1">
                  {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="flex-1 bg-primary/70 rounded-t-sm"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Navigation & Modals */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-8 flex items-center gap-2 border-b border-border pb-4">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">04</span>
              Navigation
            </h2>
            
            <div className="space-y-8">
              {/* Breadcrumbs */}
              <div className="p-4 border border-border rounded-xl bg-card flex items-center gap-2 text-sm text-muted-foreground">
                <nav aria-label="Breadcrumb" className="flex items-center gap-2">
                  <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                  <ChevronRight size={14} aria-hidden="true" />
                  <Link href="/design-system" className="hover:text-foreground transition-colors">Design System</Link>
                  <ChevronRight size={14} aria-hidden="true" />
                  <span className="text-foreground font-medium" aria-current="page">Pattern Gallery</span>
                </nav>
              </div>

              {/* Tabs */}
              <Tabs 
                tabs={[
                  { id: 'account', label: 'Account', content: <div className="text-sm text-muted-foreground">Make changes to your account here.</div> },
                  { id: 'password', label: 'Password', content: <div className="text-sm text-muted-foreground">Change your password here.</div> },
                  { id: 'settings', label: 'Settings', content: <div className="text-sm text-muted-foreground">Manage your settings here.</div> },
                ]}
              />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-8 flex items-center gap-2 border-b border-border pb-4">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">05</span>
              Modals
            </h2>
            
            <Card className="flex flex-col items-center justify-center p-12 text-center h-[300px]">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Share2 className="text-primary w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Share this page</h3>
              <p className="text-muted-foreground mb-6 text-sm max-w-xs">
                A share dialog with a working copy-link action. Closes with Escape.
              </p>
              <Button onClick={() => setIsModalOpen(true)}>Open share dialog</Button>
            </Card>

            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Share this page"
              description="Anyone with the link can open this page."
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 border border-border rounded-lg">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <Link2 size={18} className="text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Page link</p>
                    <p className="text-xs text-muted-foreground truncate font-mono">{shareUrl}</p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={async () => { if (await copyText(shareUrl)) { setLinkCopied(true); setTimeout(() => setLinkCopied(false), 1600); } }}>
                    {linkCopied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
                <Button className="w-full" onClick={() => setIsModalOpen(false)}>Done</Button>
              </div>
            </Modal>
          </div>
        </section>
      </div>
    </div>
  );
}
