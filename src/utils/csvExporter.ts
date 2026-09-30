import type { RedemptionLink } from '../types';
import { formatDate } from './dateUtils';

export function exportLinksToCSV(links: RedemptionLink[], baseUrl: string): void {
  const headers = ['Custom Name', 'Product', 'Redeem URL', 'Status', 'Usage Type', 'Uses / Max', 'Created At', 'Expires At'];
  
  const rows = links.map(link => {
    const redeemUrl = `${baseUrl.replace(/\/$/, '')}/redeem/${link.token}`;
    const productName = link.product?.name || 'Adobe Pro Plus';
    const usesDisplay = link.usage_type === 'SINGLE' ? `${link.current_uses}/1` : `${link.current_uses}/${link.max_uses}`;
    
    return [
      `"${link.custom_name.replace(/"/g, '""')}"`,
      `"${productName.replace(/"/g, '""')}"`,
      `"${redeemUrl}"`,
      `"${link.status}"`,
      `"${link.usage_type}"`,
      `"${usesDisplay}"`,
      `"${formatDate(link.created_at)}"`,
      `"${formatDate(link.expires_at)}"`
    ];
  });

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `foxmedia_redemption_links_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
