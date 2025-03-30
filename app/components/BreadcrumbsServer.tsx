import Breadcrumbs from './Breadcrumbs';

interface BreadcrumbsServerProps {
  title?: string;
  className?: string;
}

export default function BreadcrumbsServer({ title, className }: BreadcrumbsServerProps) {
  return <Breadcrumbs title={title} className={className} />;
} 