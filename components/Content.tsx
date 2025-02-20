import StructuredContent from './StructuredContent';
//import * as Blocks from './blocks/index'
const Blocks = {};

export type Props = {
	id?: string;
	content: any;
	styles?: any;
	className?: string;
	blocks?: any;
};

export default function Content({ id, content, styles, blocks, className }: Props) {
	if (!content) return null;

	return (
		<StructuredContent
			blocks={{ ...Blocks, ...blocks }}
			className={className}
			styles={{
				...styles,
			}}
			content={content}
		/>
	);
}
