import { Button, Card, CardBody } from '@wordpress/components';
import page from '@automattic/calypso-router';
import { useTranslate } from 'i18n-calypso';
import { useState } from '@wordpress/element';
import { WorkflowCanvas } from '../components/workflow-canvas';
import { TaskLibrary } from '../components/task-library';

import './workflow-builder.scss';

export function WorkflowBuilder() {
	const translate = useTranslate();
	const [ workflowName, setWorkflowName ] = useState( '' );
	const [ selectedTasks, setSelectedTasks ] = useState( [] );

	const handleSaveWorkflow = () => {
		// Placeholder for save functionality
		console.log( 'Saving workflow:', { workflowName, selectedTasks } );
		page( '/' );
	};

	const handleCancel = () => {
		page( '/' );
	};

	return (
		<div className="workflow-builder">
			<div className="workflow-builder__header">
				<div className="workflow-builder__header-content">
					<h1 className="workflow-builder__title">
						{ translate( 'Workflow Builder' ) }
					</h1>
					<div className="workflow-builder__actions">
						<Button variant="secondary" size="default" onClick={ handleCancel }>
							{ translate( 'Cancel' ) }
						</Button>
						<Button variant="primary" size="default" onClick={ handleSaveWorkflow }>
							{ translate( 'Save Workflow' ) }
						</Button>
					</div>
				</div>
			</div>

			<div className="workflow-builder__content">
				<div className="workflow-builder__sidebar">
					<Card>
						<CardBody>
							<h2 className="workflow-builder__sidebar-title">
								{ translate( 'Task Library' ) }
							</h2>
							<TaskLibrary onTaskSelect={ ( task ) => setSelectedTasks( [ ...selectedTasks, task ] ) } />
						</CardBody>
					</Card>
				</div>

				<div className="workflow-builder__canvas">
					<Card>
						<CardBody>
							<WorkflowCanvas
								workflowName={ workflowName }
								onNameChange={ setWorkflowName }
								tasks={ selectedTasks }
								onTasksChange={ setSelectedTasks }
							/>
						</CardBody>
					</Card>
				</div>
			</div>
		</div>
	);
}
