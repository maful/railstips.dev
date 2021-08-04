const tweetKeys = {
  all: ['tweets'] as const,
  lists: () => [...tweetKeys.all, 'list'] as const,
  list: (filters: string) => [...tweetKeys.lists(), { filters }] as const,
  details: () => [...tweetKeys.all, 'detail'] as const,
  detail: (id: string) => [...tweetKeys.details(), id] as const,
}

export default tweetKeys
