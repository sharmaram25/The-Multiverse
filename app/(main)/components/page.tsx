'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { Tabs } from '@/components/ui/tabs';
import { ChevronRight, Home, User, Settings, Bell, Search, Heart, Share2 } from 'lucide-react';
import Image from 'next/image';

export default function ComponentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-display">Component Library</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          A collection of reusable, animated, and accessible UI components built with Tailwind CSS and Framer Motion.
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
              <Button variant="gradient">Gradient</Button>
              <span className="text-xs text-muted-foreground">Gradient</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button variant="neon">Neon</Button>
              <span className="text-xs text-muted-foreground">Neon</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-4 bg-black rounded-lg w-full flex justify-center">
                <Button variant="glass">Glass</Button>
              </div>
              <span className="text-xs text-muted-foreground">Glass</span>
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
              <label className="text-sm font-medium">Standard Input</label>
              <Input placeholder="Enter your email" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Floating Label</label>
              <Input variant="floating" label="Username" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Input</label>
              <Input variant="search" placeholder="Search components..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password Input</label>
              <Input variant="password" placeholder="Enter password" />
            </div>
            <div className="space-y-2 lg:col-span-4">
              <label className="text-sm font-medium mb-2 block">OTP Input</label>
              <Input variant="otp" />
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
                <div className="w-12 h-12 rounded-full bg-muted overflow-hidden relative">
                  <Image src="https://picsum.photos/seed/avatar/100/100" alt="Avatar" fill className="object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <CardTitle className="text-lg">Alex Chen</CardTitle>
                  <CardDescription>Frontend Engineer</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Building the future of the web with React, Next.js, and Framer Motion.
                </p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" size="sm" className="w-full">Follow</Button>
                <Button size="sm" className="w-full">Message</Button>
              </CardFooter>
            </Card>

            {/* Product Card */}
            <Card hoverEffect className="overflow-hidden">
              <div className="h-48 bg-muted relative">
                <Image src="https://picsum.photos/seed/product/400/300" alt="Product" fill className="object-cover" referrerPolicy="no-referrer" />
                <button className="absolute top-4 right-4 p-2 bg-background/50 backdrop-blur-md rounded-full hover:bg-background/80 transition-colors">
                  <Heart size={18} />
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
                <Button className="w-full">Add to Cart</Button>
              </CardFooter>
            </Card>

            {/* Statistic Card */}
            <Card hoverEffect>
              <CardHeader className="pb-2">
                <CardDescription>Total Revenue</CardDescription>
                <CardTitle className="text-4xl">$45,231.89</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-green-500 flex items-center gap-1 font-medium">
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
                      className="flex-1 bg-primary/20 rounded-t-sm"
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
                <span className="hover:text-foreground cursor-pointer transition-colors">Home</span>
                <ChevronRight size={14} />
                <span className="hover:text-foreground cursor-pointer transition-colors">Components</span>
                <ChevronRight size={14} />
                <span className="text-foreground font-medium">Navigation</span>
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
              <h3 className="text-xl font-semibold mb-2">Share this component</h3>
              <p className="text-muted-foreground mb-6 text-sm max-w-xs">
                Click the button below to see the modal animation with backdrop blur.
              </p>
              <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
            </Card>

            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Share Component"
              description="Anyone with the link can view this component."
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 border border-border rounded-lg">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <User size={20} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Copy Link</p>
                    <p className="text-xs text-muted-foreground">https://multiverse.dev/components</p>
                  </div>
                  <Button variant="secondary" size="sm">Copy</Button>
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
