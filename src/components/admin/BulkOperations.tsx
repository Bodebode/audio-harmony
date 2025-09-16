import { useState } from 'react';
import { CheckSquare, Square, MoreHorizontal, Trash2, UserPlus, Shield, Crown, Archive, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BulkOperationsProps {
  selectedItems: string[];
  onSelectionChange: (items: string[]) => void;
  totalItems: number;
  itemType: 'users' | 'releases' | 'tracks';
  onRefresh?: () => void;
}

const BulkOperations = ({ 
  selectedItems, 
  onSelectionChange, 
  totalItems, 
  itemType,
  onRefresh 
}: BulkOperationsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const isAllSelected = selectedItems.length === totalItems && totalItems > 0;
  const isPartialSelected = selectedItems.length > 0 && selectedItems.length < totalItems;

  const handleSelectAll = () => {
    if (isAllSelected || isPartialSelected) {
      onSelectionChange([]);
    } else {
      // This would need to be handled by parent component with actual item IDs
      // For now, we'll just clear the selection
      onSelectionChange([]);
    }
  };

  const handleBulkOperation = async (operation: string) => {
    if (selectedItems.length === 0) return;

    setIsLoading(true);
    try {
      switch (itemType) {
        case 'users':
          await handleUserOperations(operation);
          break;
        case 'releases':
          await handleReleaseOperations(operation);
          break;
        case 'tracks':
          await handleTrackOperations(operation);
          break;
      }

      toast({
        title: "Success",
        description: `Bulk operation completed for ${selectedItems.length} items`,
      });

      onSelectionChange([]);
      onRefresh?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete bulk operation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserOperations = async (operation: string) => {
    switch (operation) {
      case 'make_premium':
        await supabase
          .from('profiles')
          .update({ 
            is_premium: true,
            premium_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
          })
          .in('user_id', selectedItems);
        break;
      case 'remove_premium':
        await supabase
          .from('profiles')
          .update({ 
            is_premium: false,
            premium_expires_at: null 
          })
          .in('user_id', selectedItems);
        break;
      case 'make_support':
        await supabase
          .from('profiles')
          .update({ 
            role: 'support',
            is_admin: true 
          })
          .in('user_id', selectedItems);
        break;
      case 'make_editor':
        await supabase
          .from('profiles')
          .update({ 
            role: 'editor',
            is_admin: true 
          })
          .in('user_id', selectedItems);
        break;
      case 'remove_role':
        await supabase
          .from('profiles')
          .update({ 
            role: null,
            is_admin: false 
          })
          .in('user_id', selectedItems);
        break;
    }
  };

  const handleReleaseOperations = async (operation: string) => {
    switch (operation) {
      case 'publish':
        await supabase
          .from('releases')
          .update({ status: 'live' })
          .in('id', selectedItems);
        break;
      case 'archive':
        await supabase
          .from('releases')
          .update({ status: 'archived' })
          .in('id', selectedItems);
        break;
      case 'draft':
        await supabase
          .from('releases')
          .update({ status: 'draft' })
          .in('id', selectedItems);
        break;
      case 'delete':
        await supabase
          .from('releases')
          .delete()
          .in('id', selectedItems);
        break;
    }
  };

  const handleTrackOperations = async (operation: string) => {
    switch (operation) {
      case 'publish':
        await supabase
          .from('tracks')
          .update({ status: 'ready' })
          .in('id', selectedItems);
        break;
      case 'archive':
        await supabase
          .from('tracks')
          .update({ status: 'failed' })
          .in('id', selectedItems);
        break;
      case 'delete':
        await supabase
          .from('tracks')
          .delete()
          .in('id', selectedItems);
        break;
    }
  };

  const getUserOperations = () => [
    { label: 'Make Premium', icon: Crown, action: 'make_premium' },
    { label: 'Remove Premium', icon: Crown, action: 'remove_premium' },
    { label: 'Make Support', icon: Shield, action: 'make_support' },
    { label: 'Make Editor', icon: UserPlus, action: 'make_editor' },
    { label: 'Remove Role', icon: Shield, action: 'remove_role' },
  ];

  const getReleaseOperations = () => [
    { label: 'Publish', icon: Eye, action: 'publish' },
    { label: 'Archive', icon: Archive, action: 'archive' },
    { label: 'Move to Draft', icon: EyeOff, action: 'draft' },
    { label: 'Delete', icon: Trash2, action: 'delete', destructive: true },
  ];

  const getTrackOperations = (): Array<{label: string; icon: any; action: string; destructive?: boolean}> => [
    { label: 'Publish', icon: Eye, action: 'publish' },
    { label: 'Archive', icon: Archive, action: 'archive' },
    { label: 'Delete', icon: Trash2, action: 'delete', destructive: true },
  ];

  const getOperations = () => {
    switch (itemType) {
      case 'users': return getUserOperations();
      case 'releases': return getReleaseOperations();
      case 'tracks': return getTrackOperations();
      default: return [];
    }
  };

  if (selectedItems.length === 0) return null;

  return (
    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={handleSelectAll}
        />
        <span className="text-sm font-medium">
          {selectedItems.length} selected
        </span>
        <Badge variant="secondary">
          {selectedItems.length} of {totalItems}
        </Badge>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={isLoading}>
              <MoreHorizontal className="h-4 w-4 mr-2" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Bulk Operations</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {getOperations().map((operation) => {
              const IconComponent = operation.icon;
              
              if (operation.destructive) {
                return (
                  <AlertDialog key={operation.action}>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem 
                        onSelect={(e) => e.preventDefault()}
                        className="text-destructive focus:text-destructive"
                      >
                        <IconComponent className="h-4 w-4 mr-2" />
                        {operation.label}
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently {operation.label.toLowerCase()} {selectedItems.length} {itemType}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleBulkOperation(operation.action)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {operation.label}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                );
              }

              return (
                <DropdownMenuItem 
                  key={operation.action}
                  onClick={() => handleBulkOperation(operation.action)}
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {operation.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onSelectionChange([])}
        >
          Clear Selection
        </Button>
      </div>
    </div>
  );
};

export default BulkOperations;