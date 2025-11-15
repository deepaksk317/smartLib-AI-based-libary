#!/usr/bin/env python3
"""
Fix Unicode characters in init_db.py for Windows compatibility
"""

with open('init_db.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Unicode characters with ASCII equivalents
content = content.replace('✓', '[OK]')
content = content.replace('❌', '[ERROR]')
content = content.replace('🎉', '[SUCCESS]')

with open('init_db.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed Unicode characters in init_db.py")

