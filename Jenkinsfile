pipeline {
    agent {
        label 'books-service-slave'
    }

    environment {
        DOCKER_IMAGE = 'books-service'
        DOCKER_TAG = "${BUILD_NUMBER}"
        BACKEND_HOST = '13.48.59.16'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install project dependencies
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                // Run tests
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                // Build the application
                sh 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    // Build Docker image
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }

        stage('Deploy') {
            steps {
                sshagent(['backend-instance-ssh']) { 
                    sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@\${BACKEND_HOST} '
                            docker stop ${DOCKER_IMAGE} || true
                            docker rm ${DOCKER_IMAGE} || true
                            docker run -d --name ${DOCKER_IMAGE} \
                                -p 3000:3000 \
                                ${DOCKER_IMAGE}:${DOCKER_TAG}
                        '
                    """
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished'
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
