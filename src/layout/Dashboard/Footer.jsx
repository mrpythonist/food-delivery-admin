// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function Footer() {
  const footerLinkProps = { target: '_blank', variant: 'caption', sx: { color: 'text.primary' } };
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ gap: 1.5, alignItems: 'center', justifyContent: 'space-between', p: '24px 16px 0px', mt: 'auto' }}
    >
      <Typography variant="caption">
        &copy; All rights reserved{' '}
        <Link href="https://mrpythonist.vercel.app/" target="_blank" underline="hover">
          Muhammad Aqib
        </Link>
      </Typography>
      <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="https://github.com/mrpythonist" {...footerLinkProps}>
          Github
        </Link>
      </Stack>
    </Stack>
  );
}
