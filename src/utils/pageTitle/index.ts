const defaultTitle: string = "柚竞社区";

export default function getPageTitle(
  pageTitle: string | undefined | null,
): string {
  if (pageTitle) {
    return `${pageTitle}`;
  }
  return defaultTitle;
}
