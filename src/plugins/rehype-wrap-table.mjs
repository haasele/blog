import { visit } from "unist-util-visit";

export function rehypeWrapTable() {
	return (tree) => {
		visit(tree, "element", (node, index, parent) => {
			if (node.tagName === "table" && parent) {
				// Create wrapper div
				const wrapper = {
					type: "element",
					tagName: "div",
					properties: {
						className: ["table-wrapper"],
					},
					children: [node],
				};

				// Replace original table node
				parent.children[index] = wrapper;
			}
		});
	};
}
