interface IDocTemp {
	collection: string;
	document: string;
	fields: {};
}

export class docTemplate implements IDocTemp {
	collection: string;
	document: string;
	fields: {};

	constructor(collection: string, document: string, fields: {}) {
		this.collection = collection;
		this.document = document;
		this.fields = fields;
	}
}
