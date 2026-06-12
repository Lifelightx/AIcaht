import ast
text = """
class A:
    @staticmethod
    @foo
    def bar():
        pass
"""
tree = ast.parse(text)
node = tree.body[0].body[0]

def get_source(text, node):
    if hasattr(node, 'decorator_list') and node.decorator_list:
        start_line = node.decorator_list[0].lineno
    else:
        start_line = node.lineno
    end_line = node.end_lineno
    lines = text.splitlines()
    return "\n".join(lines[start_line-1:end_line])

print(get_source(text, node))
