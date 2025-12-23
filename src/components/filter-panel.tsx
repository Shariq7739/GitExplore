
"use client";

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown, ArrowDown, ArrowUp } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { languages, licenses } from "@/lib/github-api"

export interface Filters {
  sort: string;
  sortOrder: 'asc' | 'desc';
  languages: string[];
  license: string;
  sizeRange: [number, number];
}

interface FilterPanelProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

const sortOptions = [
  { value: 'stars', label: 'Stars' },
  { value: 'forks', label: 'Forks' },
  { value: 'updated', label: 'Last Updated' },
  { value: 'created', label: 'Creation Date' },
  { value: 'size', label: 'Size' },
  { value: 'issues', label: 'Open Issues' },
];

export function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const [openLanguages, setOpenLanguages] = React.useState(false);

  const handleLanguageSelect = (lang: string) => {
    const newLanguages = filters.languages.includes(lang)
      ? filters.languages.filter(l => l !== lang)
      : [...filters.languages, lang];
    onFilterChange({ ...filters, languages: newLanguages });
  };

  return (
    <div className="p-4 rounded-lg bg-card/50 backdrop-blur-lg border border-border/20 mb-6 flex flex-wrap gap-4 items-center">
      {/* Sort By */}
      <div className="flex items-center gap-2">
        <Label>Sort by:</Label>
        <Select
          value={filters.sort}
          onValueChange={(value) => onFilterChange({ ...filters, sort: value })}
        >
          <SelectTrigger className="w-[150px] bg-background/50">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          className="w-10 h-10 bg-background/50"
          onClick={() => onFilterChange({ ...filters, sortOrder: filters.sortOrder === 'desc' ? 'asc' : 'desc' })}
          aria-label={`Sort order: ${filters.sortOrder === 'desc' ? 'descending' : 'ascending'}`}
        >
          {filters.sortOrder === 'desc' ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
        </Button>
      </div>

      {/* Language Filter */}
      <div className="flex items-center gap-2">
        <Label>Language:</Label>
        <Popover open={openLanguages} onOpenChange={setOpenLanguages}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openLanguages}
              className="w-[200px] justify-between bg-background/50"
            >
              {filters.languages.length > 0 ? `${filters.languages.length} selected` : "Select languages..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search language..." />
              <CommandList>
                <CommandEmpty>No language found.</CommandEmpty>
                <CommandGroup>
                  {languages.map((lang) => (
                    <CommandItem
                      key={lang}
                      value={lang}
                      onSelect={() => handleLanguageSelect(lang)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filters.languages.includes(lang) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {lang}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* License Filter */}
      <div className="flex items-center gap-2">
        <Label>License:</Label>
        <Select
          value={filters.license}
          onValueChange={(value) => onFilterChange({ ...filters, license: value === 'all' ? '' : value })}
        >
          <SelectTrigger className="w-[150px] bg-background/50">
            <SelectValue placeholder="Any License" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any License</SelectItem>
            {licenses.map(license => (
              <SelectItem key={license} value={license}>{license}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Size Slider */}
      <div className="flex items-center gap-3">
        <Label>Size (KB):</Label>
        <Slider
          value={filters.sizeRange}
          onValueChange={(value) => onFilterChange({ ...filters, sizeRange: value as [number, number] })}
          max={1000000}
          step={10000}
          className="w-[150px]"
        />
        <span className="text-sm text-muted-foreground">{filters.sizeRange[1] / 1000}MB</span>
      </div>
    </div>
  );
}
