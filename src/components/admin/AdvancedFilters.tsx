import { useState } from 'react';
import { Filter, X, Calendar, Users, Music, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';

export interface FilterState {
  search: string;
  dateRange: {
    from?: Date;
    to?: Date;
  };
  status?: string;
  role?: string;
  isPremium?: boolean;
  releaseType?: string;
}

interface AdvancedFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  filterType: 'users' | 'releases' | 'content';
}

const AdvancedFilters = ({ filters, onFiltersChange, filterType }: AdvancedFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters = () => {
    return filters.search || 
           filters.dateRange.from || 
           filters.status || 
           filters.role || 
           filters.isPremium !== undefined ||
           filters.releaseType;
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.dateRange.from) count++;
    if (filters.status) count++;
    if (filters.role) count++;
    if (filters.isPremium !== undefined) count++;
    if (filters.releaseType) count++;
    return count;
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      dateRange: {},
      status: undefined,
      role: undefined,
      isPremium: undefined,
      releaseType: undefined,
    });
  };

  const clearSpecificFilter = (filterKey: keyof FilterState) => {
    const newFilters = { ...filters };
    if (filterKey === 'dateRange') {
      newFilters.dateRange = {};
    } else {
      (newFilters as any)[filterKey] = undefined;
    }
    onFiltersChange(newFilters);
  };

  const ActiveFilterBadges = () => {
    const badges = [];

    if (filters.search) {
      badges.push(
        <Badge key="search" variant="secondary" className="gap-1">
          Search: {filters.search}
          <X 
            className="h-3 w-3 cursor-pointer hover:text-destructive" 
            onClick={() => clearSpecificFilter('search')}
          />
        </Badge>
      );
    }

    if (filters.dateRange.from) {
      badges.push(
        <Badge key="date" variant="secondary" className="gap-1">
          <Calendar className="h-3 w-3" />
          {filters.dateRange.from.toLocaleDateString()}
          {filters.dateRange.to && ` - ${filters.dateRange.to.toLocaleDateString()}`}
          <X 
            className="h-3 w-3 cursor-pointer hover:text-destructive" 
            onClick={() => clearSpecificFilter('dateRange')}
          />
        </Badge>
      );
    }

    if (filters.status) {
      badges.push(
        <Badge key="status" variant="secondary" className="gap-1 capitalize">
          {filters.status}
          <X 
            className="h-3 w-3 cursor-pointer hover:text-destructive" 
            onClick={() => clearSpecificFilter('status')}
          />
        </Badge>
      );
    }

    if (filters.role) {
      badges.push(
        <Badge key="role" variant="secondary" className="gap-1 capitalize">
          <Users className="h-3 w-3" />
          {filters.role}
          <X 
            className="h-3 w-3 cursor-pointer hover:text-destructive" 
            onClick={() => clearSpecificFilter('role')}
          />
        </Badge>
      );
    }

    if (filters.isPremium !== undefined) {
      badges.push(
        <Badge key="premium" variant="secondary" className="gap-1">
          <Crown className="h-3 w-3" />
          {filters.isPremium ? 'Premium' : 'Free'}
          <X 
            className="h-3 w-3 cursor-pointer hover:text-destructive" 
            onClick={() => clearSpecificFilter('isPremium')}
          />
        </Badge>
      );
    }

    if (filters.releaseType) {
      badges.push(
        <Badge key="releaseType" variant="secondary" className="gap-1 capitalize">
          <Music className="h-3 w-3" />
          {filters.releaseType}
          <X 
            className="h-3 w-3 cursor-pointer hover:text-destructive" 
            onClick={() => clearSpecificFilter('releaseType')}
          />
        </Badge>
      );
    }

    return badges;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Advanced Filters
                {hasActiveFilters() && (
                  <Badge variant="secondary" className="ml-1">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <Card className="border-0 shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Advanced Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search */}
                  <div className="space-y-2">
                    <Label htmlFor="search">Search</Label>
                    <Input
                      id="search"
                      placeholder={`Search ${filterType}...`}
                      value={filters.search}
                      onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                    />
                  </div>

                  {/* Date Range */}
                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <Calendar className="mr-2 h-4 w-4" />
                          {filters.dateRange.from ? (
                            filters.dateRange.to ? (
                              <>
                                {filters.dateRange.from.toLocaleDateString()} -{" "}
                                {filters.dateRange.to.toLocaleDateString()}
                              </>
                            ) : (
                              filters.dateRange.from.toLocaleDateString()
                            )
                          ) : (
                            "Pick a date range"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          initialFocus
                          mode="range"
                          defaultMonth={filters.dateRange.from}
                          selected={{
                            from: filters.dateRange.from,
                            to: filters.dateRange.to,
                          }}
                          onSelect={(range) => 
                            onFiltersChange({ 
                              ...filters, 
                              dateRange: { from: range?.from, to: range?.to }
                            })
                          }
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <Separator />

                  {/* Type-specific filters */}
                  {filterType === 'users' && (
                    <>
                      <div className="space-y-2">
                        <Label>User Role</Label>
                        <Select 
                          value={filters.role || ''} 
                          onValueChange={(value) => 
                            onFiltersChange({ ...filters, role: value || undefined })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All roles" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All roles</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="support">Support</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Premium Status</Label>
                        <Select 
                          value={filters.isPremium?.toString() || ''} 
                          onValueChange={(value) => 
                            onFiltersChange({ 
                              ...filters, 
                              isPremium: value ? value === 'true' : undefined 
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All users" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All users</SelectItem>
                            <SelectItem value="true">Premium</SelectItem>
                            <SelectItem value="false">Free</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {filterType === 'releases' && (
                    <>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select 
                          value={filters.status || ''} 
                          onValueChange={(value) => 
                            onFiltersChange({ ...filters, status: value || undefined })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All statuses" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All statuses</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="live">Live</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Release Type</Label>
                        <Select 
                          value={filters.releaseType || ''} 
                          onValueChange={(value) => 
                            onFiltersChange({ ...filters, releaseType: value || undefined })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All types" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All types</SelectItem>
                            <SelectItem value="album">Album</SelectItem>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="ep">EP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  <Separator />

                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearFilters}
                      disabled={!hasActiveFilters()}
                    >
                      Clear All
                    </Button>
                    <Button size="sm" onClick={() => setIsOpen(false)}>
                      Apply Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </PopoverContent>
          </Popover>

          {hasActiveFilters() && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters() && (
        <div className="flex flex-wrap gap-2">
          <ActiveFilterBadges />
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;