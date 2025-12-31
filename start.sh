#!/bin/bash
nohup ./glyph_code_tools_linux  >./glyph_tools.log 2>&1 &
exec nginx -g "daemon off;"