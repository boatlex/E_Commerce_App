export function redirectSystemPath({ path }: { path: string; initial: boolean }) {
  if (path.includes('oauth-native-callback')) {
    const parts = path.split('?');
    const queryParams = parts[1];  
    return queryParams ? `/?${queryParams}` : '/';
  }
  
  return path;
}



