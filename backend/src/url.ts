// TODO: Move to future dedicated shared folder/repo between client and server
export const buildURLBase = ({
  ssl = false,
  hostname,
  port,
}: {
  ssl?: boolean;
  hostname: string;
  port?: number;
}) => "http" + (ssl ? "s" : "") + "://" + hostname + (port ? ":" + port : "");
