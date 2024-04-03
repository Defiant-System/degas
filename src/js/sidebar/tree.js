
// doob.sidebar.tree

{
	init() {
		// fast references
		this.els = {
			el: window.find(".sidebar .tree"),
		};
		// render blank view
		window.render({
			template: "tree",
			match: `//Tree`,
			target: this.els.el,
		});

		// temp
		// setTimeout(() => this.els.el.find(".row:nth(5)").trigger("click"), 100);
		// setTimeout(() => this.els.el.find(".row:nth(3) .icon-arrow").trigger("click"), 100);

		// setTimeout(() => {
		// 	this.dispatch({ type: "remove", id: "3" });
		// }, 1300);


		// setTimeout(() => {
		// 	this.dispatch({ type: "rename", id: "3", name: "Apple" });
		// }, 1300);

		/*
		setTimeout(() => {
			let node = {
					id: 10,
					expanded: 0,
					icon: "mesh",
					name: "Banana",
					children: [
						{ id: 11, icon: "mesh", name: "Test 2" },
						{ id: 12, icon: "mesh", name: "Test 3" },
					]
				};
			this.dispatch({
				type: "add",
				insert: "before",
				id: "3",
				node
			});
		}, 300);
		*/
	},
	dispatch(event) {
		let APP = doob,
			Self = APP.sidebar.tree,
			xInsert,
			xAnchorId,
			xAnchor,
			xNode,
			name,
			value,
			el;
		// console.log(event);
		switch(event.type) {
			case "handle-tree-event":
				el = $(event.target);
				if (el.data("type")) {
					return Self.dispatch({ ...event, type: el.data("type") });
				}
				el.parents(".tree").find(".selected").removeClass("selected");
				el.addClass("selected");
				// TODO: focus / select on object
				break;
			case "toggle-expand":
				el = $(event.target).parents(".row:first");
				if (el.hasClass("expanded")) {
					el.removeClass("expanded");
				} else {
					if (!el.find(".children").length) {
						// render blank view
						window.render({
							template: "tree-children",
							match: `//Tree//*[@id="${el.data("id")}"]`,
							append: el,
						});
					}
					// delay "animation" to next tick - wait for render finish
					requestAnimationFrame(() => el.addClass("expanded"));
				}
				break;
			case "toggle-visibility":
				el = $(event.target);
				if (el.hasClass("icon-eye-on")) el.prop({ className: "icon-eye-off" });
				else el.prop({ className: "icon-eye-on" });
				break;
			case "add":
				let str = [],
					xParse = node => {
						let expand = node.expanded !== undefined ? `expanded="${node.expanded}"` : "";
						str.push(`<i id="${node.id}" icon="${node.icon}" name="${node.name}" ${expand}>`);
						if (node.children) node.children.map(n => xParse(n));
						str.push(`</i>`);
					};
				// parse node
				xParse(event.node);

				xInsert = event.insert || "append";
				xAnchorId = event.id || window.bluePrint.selectSingleNode(`//Tree//i`).getAttribute("id");
				xAnchor = window.bluePrint.selectSingleNode(`//Tree//i[@id="${xAnchorId}"]`);
				xNode = $.xmlFromString(`<data>${str.join("\n")}</data>`).selectSingleNode(`//data/i`);
				switch (xInsert) {
					case "before":
						xAnchor.parentNode.insertBefore(xNode, xAnchor);
						window.render({
							template: "tree-node",
							match: `//Tree//*[@id="${xNode.getAttribute("id")}"]`,
							before: Self.els.el.find(`.row[data-id="${xAnchor.getAttribute("id")}"]`),
						});
						break;
					case "after":
						xAnchor.parentNode.insertBefore(xNode, xAnchor.nextSibling);
						window.render({
							template: "tree-node",
							match: `//Tree//*[@id="${xNode.getAttribute("id")}"]`,
							after: Self.els.el.find(`.row[data-id="${xAnchor.getAttribute("id")}"]`),
						});
						break;
					case "prepend":
						xAnchor.insertBefore(xNode, xAnchor.firstChild);
						window.render({
							template: "tree-node",
							match: `//Tree//*[@id="${xNode.getAttribute("id")}"]`,
							prepend: Self.els.el.find(`.row[data-id="${xAnchor.getAttribute("id")}"] > .children > div`),
						});
						break;
					default: // append
						xAnchor.appendChild(xNode);
						window.render({
							template: "tree-node",
							match: `//Tree//*[@id="${xNode.getAttribute("id")}"]`,
							append: Self.els.el.find(`.row[data-id="${xAnchor.getAttribute("id")}"] > .children > div`),
						});
				}
				break;
			case "rename":
				// rename xml node
				xNode = window.bluePrint.selectSingleNode(`//Tree//i[@id="${event.id}"]`);
				xNode.setAttribute("name", event.name);
				// rename html node
				Self.els.el.find(`.row[data-id="${event.id}"] > .item > span`).html(event.name);
				break;
			case "remove":
				// remove xml node
				xNode = window.bluePrint.selectSingleNode(`//Tree//i[@id="${event.id}"]`);
				xNode.parentNode.removeChild(xNode);
				// remove html node
				Self.els.el.find(`.row[data-id="${event.id}"]`).remove();
				break;
		}
	}
}
