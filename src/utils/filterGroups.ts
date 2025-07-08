export interface Group {
  path: string;
  [key: string]: any;
}

export interface DataWithGroups {
  groups: Group[];
}

// Accepts an object that directly contains a `groups` array or a wrapper with
// `data.groups`. Only groups with a path starting with the provided prefix are
// returned.
export function filterGroupsByPath(
  obj: { data?: DataWithGroups } | DataWithGroups,
  prefix = "/EAZLE"
): Group[] {
  const groups = (obj as DataWithGroups).groups || obj.data?.groups || [];
  return groups.filter((g) => typeof g.path === "string" && g.path.startsWith(prefix));
}
