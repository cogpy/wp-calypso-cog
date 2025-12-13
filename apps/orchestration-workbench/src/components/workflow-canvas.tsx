import { TextControl, Button } from '@wordpress/components';
import { useTranslate } from 'i18n-calypso';

import './workflow-canvas.scss';

interface Task {
	id: string;
	name: string;
	description: string;
	category: string;
	icon: string;
}

interface WorkflowCanvasProps {
	workflowName: string;
	onNameChange: ( name: string ) => void;
	tasks: Task[];
	onTasksChange: ( tasks: Task[] ) => void;
}

export function WorkflowCanvas( {
	workflowName,
	onNameChange,
	tasks,
	onTasksChange,
}: WorkflowCanvasProps ) {
	const translate = useTranslate();

	const handleRemoveTask = ( taskId: string ) => {
		onTasksChange( tasks.filter( ( task ) => task.id !== taskId ) );
	};

	return (
		<div className="workflow-canvas">
			<div className="workflow-canvas__header">
				<TextControl
					label={ translate( 'Workflow Name' ) }
					value={ workflowName }
					onChange={ onNameChange }
					placeholder={ translate( 'Enter workflow name...' ) }
					className="workflow-canvas__name-input"
				/>
			</div>

			<div className="workflow-canvas__content">
				{ tasks.length === 0 ? (
					<div className="workflow-canvas__empty">
						<div className="workflow-canvas__empty-icon">
							<svg
								width="80"
								height="80"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M12 5V19M5 12H19"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</div>
						<h3 className="workflow-canvas__empty-title">
							{ translate( 'Start Building Your Workflow' ) }
						</h3>
						<p className="workflow-canvas__empty-description">
							{ translate(
								'Select tasks from the library on the left to add them to your workflow.'
							) }
						</p>
					</div>
				) : (
					<div className="workflow-canvas__tasks">
						{ tasks.map( ( task, index ) => (
							<div key={ `${ task.id }-${ index }` }>
								<div className="workflow-canvas__task">
									<div className="workflow-canvas__task-number">{ index + 1 }</div>
									<div className="workflow-canvas__task-icon">{ task.icon }</div>
									<div className="workflow-canvas__task-info">
										<div className="workflow-canvas__task-name">{ task.name }</div>
										<div className="workflow-canvas__task-description">
											{ task.description }
										</div>
									</div>
									<Button
										variant="secondary"
										size="small"
										isDestructive
										onClick={ () => handleRemoveTask( task.id ) }
									>
										{ translate( 'Remove' ) }
									</Button>
								</div>
								{ index < tasks.length - 1 && (
									<div className="workflow-canvas__connector">
										<svg
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M12 5V19M12 19L5 12M12 19L19 12"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</div>
								) }
							</div>
						) ) }
					</div>
				) }
			</div>
		</div>
	);
}
