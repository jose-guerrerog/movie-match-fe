'use client'

// Dynamically import the client component
import React, { Suspense } from 'react';
import { SearchContent } from './search-content';

export default function SearchPage() {
  return 
    <Suspense fallback={<div className="text-center py-20">Loading search results...</div>}>
      <SearchContent />
    </Suspense>
};