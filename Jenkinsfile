pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'books-service'
        DOCKER_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkouut scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    docker.build "${DOCKER_IMAGE}:${DOCKER_TAG}"
                }
            }
        }

        stage('Deploy') {
            steps {
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
}