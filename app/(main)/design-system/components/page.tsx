'use client';

import React, { useState } from 'react';
import { ArrowRight, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { DocHeader, DocSection, Example, PropsTable } from '@/components/docs/doc-blocks';

const TABS = ['Button', 'Card', 'Input', 'Badge', 'Modal'] as const;
type Tab = (typeof TABS)[number];

export default function ComponentsDocsPage() {
  const [tab, setTab] = useState<Tab>('Button');
  return (
    <div>
      <DocHeader title="Components" lead="Production components from components/ui. Every example below is live, uses the active universe's tokens, and ships with copyable usage code." />
      <div role="tablist" aria-label="Component" className="mb-10 flex gap-1 rounded-xl border border-border bg-card p-1">
        {TABS.map((t) => (
          <button key={t} role="tab" type="button" aria-selected={tab === t} onClick={() => setTab(t)} className={cn('flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors', tab === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
            {t}
          </button>
        ))}
      </div>
      {tab === 'Button' && <ButtonDocs />}
      {tab === 'Card' && <CardDocs />}
      {tab === 'Input' && <InputDocs />}
      {tab === 'Badge' && <BadgeDocs />}
      {tab === 'Modal' && <ModalDocs />}
    </div>
  );
}

function ButtonDocs() {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <DocSection title="Variants" description="Choose by emphasis. Use one default (primary) button per view.">
        <Example code={`<Button>Save changes</Button>\n<Button variant="outline">Cancel</Button>\n<Button variant="secondary">Duplicate</Button>\n<Button variant="ghost">More</Button>\n<Button variant="link">Learn more</Button>\n<Button variant="destructive">Delete</Button>`}>
          <Button>Save changes</Button>
          <Button variant="outline">Cancel</Button>
          <Button variant="secondary">Duplicate</Button>
          <Button variant="ghost">More</Button>
          <Button variant="link">Learn more</Button>
          <Button variant="destructive">Delete</Button>
        </Example>
      </DocSection>
      <DocSection title="Sizes and icons">
        <Example code={`<Button size="sm">Small</Button>\n<Button>Default</Button>\n<Button size="lg">Continue <ArrowRight /></Button>\n<Button size="icon" aria-label="Download"><Download /></Button>`}>
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Continue <ArrowRight size={16} className="ml-2" /></Button>
          <Button size="icon" aria-label="Download"><Download size={16} /></Button>
        </Example>
      </DocSection>
      <DocSection title="States">
        <Example code={`<Button isLoading={loading} onClick={save}>Save</Button>\n<Button disabled>Unavailable</Button>`}>
          <Button isLoading={loading} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1600); }}>{loading ? 'Saving…' : 'Click to save'}</Button>
          <Button disabled>Unavailable</Button>
        </Example>
      </DocSection>
      <DocSection title="Props">
        <PropsTable rows={[
          { name: 'variant', type: "'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive'", default: "'default'", description: 'Visual emphasis.' },
          { name: 'size', type: "'sm' | 'default' | 'lg' | 'icon'", default: "'default'", description: 'Height and padding.' },
          { name: 'isLoading', type: 'boolean', default: 'false', description: 'Shows a spinner and disables the button.' },
          { name: 'asChild', type: 'boolean', default: 'false', description: 'Render the child element (e.g. a Link) with button styles.' },
        ]} />
      </DocSection>
    </>
  );
}

function CardDocs() {
  return (
    <>
      <DocSection title="Composition" description="Card is composed from header, content and footer parts.">
        <Example className="justify-start" code={`<Card>\n  <CardHeader>\n    <CardTitle>Pro plan</CardTitle>\n    <CardDescription>For growing teams</CardDescription>\n  </CardHeader>\n  <CardContent>Unlimited projects and priority support.</CardContent>\n  <CardFooter><Button className="w-full">Upgrade</Button></CardFooter>\n</Card>`}>
          <Card className="w-80">
            <CardHeader>
              <CardTitle>Pro plan</CardTitle>
              <CardDescription>For growing teams</CardDescription>
            </CardHeader>
            <CardContent><p className="text-sm">Unlimited projects and priority support.</p></CardContent>
            <CardFooter><Button className="w-full">Upgrade</Button></CardFooter>
          </Card>
        </Example>
      </DocSection>
      <DocSection title="Interactive" description="hoverEffect adds a universe-appropriate hover response.">
        <Example code={`<Card hoverEffect>…</Card>`}>
          <Card hoverEffect className="w-80">
            <CardHeader><CardTitle>Hover me</CardTitle><CardDescription>Motion follows the active universe.</CardDescription></CardHeader>
          </Card>
        </Example>
      </DocSection>
      <DocSection title="Props">
        <PropsTable rows={[{ name: 'hoverEffect', type: 'boolean', default: 'false', description: 'Adds hover lift / glow / offset depending on universe.' }]} />
      </DocSection>
    </>
  );
}

function InputDocs() {
  return (
    <>
      <DocSection title="Variants">
        <Example className="grid grid-cols-2 items-start gap-6" code={`<Input placeholder="Company name" />\n<Input variant="floating" label="Email address" />\n<Input variant="search" placeholder="Search projects" />\n<Input variant="password" placeholder="Password" />`}>
          <Input placeholder="Company name" aria-label="Company name" />
          <Input variant="floating" label="Email address" />
          <Input variant="search" placeholder="Search projects" aria-label="Search projects" />
          <Input variant="password" placeholder="Password" aria-label="Password" />
        </Example>
      </DocSection>
      <DocSection title="One-time code">
        <Example code={`<Input variant="otp" />`}>
          <Input variant="otp" aria-label="Verification code" />
        </Example>
      </DocSection>
      <DocSection title="Props">
        <PropsTable rows={[
          { name: 'variant', type: "'default' | 'floating' | 'search' | 'password' | 'otp'", default: "'default'", description: 'Input presentation.' },
          { name: 'label', type: 'string', description: 'Visible label (floating variant).' },
        ]} />
      </DocSection>
    </>
  );
}

function BadgeDocs() {
  return (
    <>
      <DocSection title="Variants" description="Short status labels. Do not rely on color alone — the text carries the meaning.">
        <Example code={`<Badge>New</Badge>\n<Badge variant="secondary">Draft</Badge>\n<Badge variant="outline">v2.0</Badge>\n<Badge variant="success">Passed</Badge>\n<Badge variant="warning">Review</Badge>\n<Badge variant="destructive">Failed</Badge>`}>
          <Badge>New</Badge>
          <Badge variant="secondary">Draft</Badge>
          <Badge variant="outline">v2.0</Badge>
          <Badge variant="success">Passed</Badge>
          <Badge variant="warning">Review</Badge>
          <Badge variant="destructive">Failed</Badge>
        </Example>
      </DocSection>
      <DocSection title="Props">
        <PropsTable rows={[{ name: 'variant', type: "'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive'", default: "'default'", description: 'Status color.' }]} />
      </DocSection>
    </>
  );
}

function ModalDocs() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <DocSection title="Dialog" description="Locks page scroll while open. Close with the button, the backdrop or Escape.">
        <Example code={`const [open, setOpen] = useState(false);\n\n<Button onClick={() => setOpen(true)}>Open dialog</Button>\n<Modal isOpen={open} onClose={() => setOpen(false)} title="Publish page" description="It will be visible to everyone with the link.">\n  …\n</Modal>`}>
          <Button onClick={() => setOpen(true)}>Open dialog</Button>
        </Example>
        <Modal isOpen={open} onClose={() => setOpen(false)} title="Publish page" description="It will be visible to everyone with the link.">
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => setOpen(false)}>Publish</Button>
          </div>
        </Modal>
      </DocSection>
      <DocSection title="Props">
        <PropsTable rows={[
          { name: 'isOpen', type: 'boolean', description: 'Controls visibility.' },
          { name: 'onClose', type: '() => void', description: 'Called on backdrop click, close button or Escape.' },
          { name: 'title', type: 'string', description: 'Dialog heading.' },
          { name: 'description', type: 'string', description: 'Supporting text under the title.' },
        ]} />
      </DocSection>
    </>
  );
}
