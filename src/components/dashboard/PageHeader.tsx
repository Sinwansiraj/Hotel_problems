import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  breadcrumb?: string[];
}

export function PageHeader({ title, subtitle, actions, breadcrumb }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {breadcrumb && (
        <nav className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          {breadcrumb.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span>/</span>}
              <span className={i === breadcrumb.length - 1 ? 'text-foreground font-medium' : ''}>{crumb}</span>
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
