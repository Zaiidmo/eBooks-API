pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'books-service'
        DOCKER_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                // Fixed the typo 'checkouut' to 'checkout'
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
                // Stop and remove the previous container if it exists, then run the new one
                sh """
                    docker stop ${DOCKER_IMAGE} || true
                    docker rm ${DOCKER_IMAGE} || true
                    docker run -d --name ${DOCKER_IMAGE} \
                        -p 3000:3000 \
                        ${DOCKER_IMAGE}:${DOCKER_TAG}
                """
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
