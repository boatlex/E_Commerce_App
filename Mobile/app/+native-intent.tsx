export function redirectSystemPath({ path }: { path: string; initial: boolean }) {
  if (path.includes('oauth-native-callback')) {
    return path;
  }
  
  return path;
}





