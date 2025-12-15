import { Button } from '@wordpress/components';
import { useTranslate } from 'i18n-calypso';

import './task-library.scss';

interface Task {
	id: string;
	name: string;
	description: string;
	category: string;
	icon: string;
}

interface TaskLibraryProps {
	onTaskSelect: ( task: Task ) => void;
}

export function TaskLibrary( { onTaskSelect }: TaskLibraryProps ) {
	const translate = useTranslate();

	const tasks: Task[] = [
		{
			id: 'update-plugins',
			name: translate( 'Update Plugins' ),
			description: translate( 'Automatically update WordPress plugins' ),
			category: translate( 'Maintenance' ),
			icon: '🔄',
		},
		{
			id: 'backup-site',
			name: translate( 'Backup Site' ),
			description: translate( 'Create a full site backup' ),
			category: translate( 'Maintenance' ),
			icon: '💾',
		},
		{
			id: 'publish-post',
			name: translate( 'Publish Post' ),
			description: translate( 'Publish a scheduled post' ),
			category: translate( 'Content' ),
			icon: '📝',
		},
		{
			id: 'optimize-images',
			name: translate( 'Optimize Images' ),
			description: translate( 'Compress and optimize images' ),
			category: translate( 'Performance' ),
			icon: '🖼️',
		},
		{
			id: 'clear-cache',
			name: translate( 'Clear Cache' ),
			description: translate( 'Clear all site caches' ),
			category: translate( 'Performance' ),
			icon: '🧹',
		},
		{
			id: 'security-scan',
			name: translate( 'Security Scan' ),
			description: translate( 'Run security vulnerability scan' ),
			category: translate( 'Security' ),
			icon: '🔒',
		},
	];

	const categories = [ ...new Set( tasks.map( ( task ) => task.category ) ) ];

	return (
		<div className="task-library">
			{ categories.map( ( category ) => (
				<div key={ category } className="task-library__category">
					<h3 className="task-library__category-title">{ category }</h3>
					<div className="task-library__tasks">
						{ tasks
							.filter( ( task ) => task.category === category )
							.map( ( task ) => (
								<div key={ task.id } className="task-library__task">
									<div className="task-library__task-icon">{ task.icon }</div>
									<div className="task-library__task-info">
										<div className="task-library__task-name">{ task.name }</div>
										<div className="task-library__task-description">
											{ task.description }
										</div>
									</div>
									<Button
										variant="secondary"
										size="small"
										onClick={ () => onTaskSelect( task ) }
									>
										{ translate( 'Add' ) }
									</Button>
								</div>
							) ) }
					</div>
				</div>
			) ) }
		</div>
	);
}
