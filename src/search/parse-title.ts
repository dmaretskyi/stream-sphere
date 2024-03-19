const QUALITY_TAGS = ['2160p', '1080p', '720p'];

const TAGS = [
  'UNCENSORED',
  'BDRip',
  'BluRay',
  'DVDRip',
  'HDTV',
  'WEBRip',
  'WEB-DL',
  'WEBDL',
  'WEB',

  ...QUALITY_TAGS,

  'HEVC',
  'x264',
  'x265',
  'H264',
];

const REGEXES = [
  {
    regex: /[\s\.]S(\d{2})E(\d{2})[\s\.]/i,
    groups: ['season', 'episode'],
  },
  {
    regex: /[\s\.]Season[\s\.](\d+)[\s\.]/i,
    groups: ['season'],
  },
  {
    regex: /[\s\.]S(\d{2})[\s\.]/i,
    groups: ['season'],
  },
  {
    regex: /[\s\.]E(\d{2})[\s\.]/i,
    groups: ['episode'],
  },
];

type TitleParseResult = {
  season?: string;
  episode?: string;

  quality?: string;

  tags: string[];
};

export const parseTitle = (title: string): TitleParseResult => {
  const tags = TAGS.filter((tag) => title.includes(tag));

  const result: TitleParseResult = {
    tags,
  };

  for (const { regex, groups } of REGEXES) {
    const match = title.match(regex);

    if (match) {
      groups.forEach((group, idx) => {
        result[group as keyof TitleParseResult] = parseInt(
          match[idx + 1]
        ) as any;
      });
    }
  }

  for (const qualityTag of QUALITY_TAGS) {
    if (tags.includes(qualityTag)) {
      result.quality = qualityTag;
      break;
    }
  }

  return result;
};
